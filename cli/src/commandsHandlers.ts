import { execSync } from "child_process"
import * as fs from 'fs'
import * as afs from 'node:fs/promises'
import path from "path"
import color from 'picocolors'
import { authorizeDevice } from './auth/device.js'
import * as p from './clack-lib/prompts/index.js'
import { GO_BACKEND_URL, Script, ScriptsFunction, TEMPLATES_PATH } from './constants.js'
import { WORK_DIR } from './index.js'
import { CopyDirectoryContentsParams, copyDirectoryContents, createMetadataFile, getFilesIgnoredByGit, loadSettings, saveSettings, sendTelemetryStats, walkDir } from "./utils.js"
import { inspect } from "util"

interface SaveOptions {
    templateName: string
    sourceRelativePaths: string[]
    withGitignore: boolean
    templateDescription?: string
}

export async function save({ templateName, sourceRelativePaths, withGitignore, templateDescription }: SaveOptions) {
    const templatePath = path.normalize(`${TEMPLATES_PATH()}/${templateName}`)
    if (fs.existsSync(templatePath)) {
        let override = await p.confirm({
            message: `Template ${templateName} already exists. Override It?`,
            initialValue: false
        }) as boolean

        if (override) fs.rmSync(templatePath, { recursive: true, force: true })
        else {
            p.log.error(`Aborted saving ${color.cyan(templateName)} template.`)
            return
        }
    }

    for (const sourceRelativePath of sourceRelativePaths) {
        const sourceAbsolutePath = path.normalize(`${WORK_DIR}/${sourceRelativePath}`)
        const copyArgs: CopyDirectoryContentsParams = {
            fromPath: sourceAbsolutePath,
            toPath: templatePath,
        }

        if (!fs.existsSync(sourceAbsolutePath)) {
            p.log.error(`Directory specified as source: ${sourceAbsolutePath} does not exist`)
            return
        }

        let ignoredFiles: string[] = []
        if (withGitignore) {
            try {
                ignoredFiles = await getFilesIgnoredByGit()
                copyArgs.validate = ({ createName, createPath, isFile, sourcePath }) => {
                    if (ignoredFiles.includes(createName)) {
                        p.log.info(`${color.dim(createName)} ignored by git. Skipping It...`)
                        return false
                    }
                    return true
                }
            } catch (e) {
                p.log.warn(`Problem with checking git files: ${color.dim((e as Error).message)}`)
            }
        }

        const stat = fs.statSync(sourceAbsolutePath)
        if (stat.isFile()) {
            const dirStructure = path.dirname(sourceRelativePath)
            const fileContent = fs.readFileSync(sourceAbsolutePath, 'utf8')

            if (!fs.existsSync(`${templatePath}/${dirStructure}`)) {
                await afs.mkdir(`${templatePath}/${dirStructure}`, { recursive: true })
            }
            fs.writeFileSync(`${templatePath}/${sourceRelativePath}`, fileContent, 'utf8')
        }
        else {
            await afs.mkdir(`${templatePath}/${sourceRelativePath}`, { recursive: true })
            copyArgs.toPath = `${templatePath}/${sourceRelativePath}`
            await copyDirectoryContents(copyArgs)
            createMetadataFile({ directoryPath: templatePath, templateDesc: templateDescription })
        }
    }
    p.log.success(`Saved ${color.cyan(templateName)} template at ${color.dim(templatePath)}`)
    sendTelemetryStats("templateSaved")
}


interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export async function paste({ templateName, destinationRelativePath }: PasteOptions) {
    const templatePath = path.normalize(`${TEMPLATES_PATH()}/${templateName}`)
    const destinationAbsolutePath = path.normalize(`${WORK_DIR}/${destinationRelativePath}`)

    if (!fs.existsSync(templatePath)) {
        p.log.error(`Template ${templateName} does not exist. Aborting.`)
        return
    }

    if (!fs.existsSync(destinationAbsolutePath)) {
        fs.mkdirSync(destinationAbsolutePath, { recursive: true })
        p.log.info(`Directory ${color.dim(destinationAbsolutePath)} does not exists. Creating it...`)
    }

    await copyDirectoryContents({ fromPath: templatePath, toPath: destinationAbsolutePath })
    p.log.success(`Pasted ${templateName} template to ${color.dim(destinationAbsolutePath)}`)
    sendTelemetryStats("templatePasted")
}


export function list() {
    const templates = fs.readdirSync(TEMPLATES_PATH())

    if (templates.length === 0) {
        p.log.warn(`You don't have any saved templates.`)
        return
    }

    p.log.success(`Your templates:`)
    templates.forEach(template => {
        console.log(`${color.gray(p.S_BAR)}  ${color.dim(template)}`)
    })
}

interface RunScriptOptions {
    functionToRun: ScriptsFunction
    functionParams: string[]
}

export async function runScript({ functionParams = [], functionToRun }: RunScriptOptions) {
    // @ts-ignore
    const commands = functionToRun(...functionParams)
    const concatedCommands = commands.join('\n')

    p.log.info(`Running following commands, follow on-screen prompts.`)
    commands.forEach(command => {
        console.log(`${color.gray(p.S_BAR)}  ${color.green(command)}`)
    })

    execSync(concatedCommands, { stdio: 'inherit' })

    p.log.success(`Script ${functionToRun.name} finished successfully.`)
    sendTelemetryStats("scriptRan")
}

export async function signIn() {
    const token = await authorizeDevice()
    saveSettings({ githubToken: token.access_token })
    p.log.success(`Signed in successfully.`)
}

type SaveScriptParams = {
    scriptName: string
    scriptPath: string
    isPublic: boolean
}
export async function saveScriptAtRemote({ scriptName, isPublic, scriptPath }: SaveScriptParams) {
    const scriptInterpreted = await import(scriptPath).then(moduleExport => moduleExport.default) as Script
    const scriptFile = fs.readFileSync(scriptPath, 'utf8')

    const res = await fetch(`${GO_BACKEND_URL}/api/scripts`, {
        method: 'POST',
        headers: {
            'Authorization': `${loadSettings().githubToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: scriptName,
            isPublic: isPublic,
            tags: scriptInterpreted.tags,
            description: scriptInterpreted.description,
            content: scriptFile
        }),
    })
    if (!res.ok) {
        p.log.error(`Failed to save script at remote.`)
        console.log(await res.json())
        return
    }

    p.log.success(`Script saved at remote.`)
}

type TemplateEntry = {
    name: string,
    isDir: true,
    content: null,
    children: TemplateEntry[],
} | {
    name: string,
    isDir: false,
    content: string,
    children: null,
}
type SaveTemplateReqBody = {
    isPublic: boolean
    tags: string[]
    files: {
        name: string
        content: null
        isDir: true
        children: TemplateEntry[]
    }
}
type SaveTemplateParams = {
    templateName: string
    templatePath: string
    isPublic: boolean
}

function buildTemplateFilesTree(templatePath: string): TemplateEntry[] {
    const files = fs.readdirSync(templatePath)
    const templateFiles: TemplateEntry[] = []
    for (const file of files) {
        const stat = fs.statSync(`${templatePath}/${file}`)
        if (stat.isFile()) {
            const fileContent = fs.readFileSync(`${templatePath}/${file}`, 'utf8')
            templateFiles.push({
                name: file,
                isDir: false,
                content: fileContent,
                children: null,
            })
        } else {
            const children = buildTemplateFilesTree(`${templatePath}/${file}`)
            templateFiles.push({
                name: file,
                isDir: true,
                content: null,
                children: children,
            })
        }
    }
    return templateFiles
}

export async function saveTemplateAtRemote({ isPublic, templateName, templatePath }: SaveTemplateParams) {
    const reqBody: SaveTemplateReqBody = {
        isPublic: isPublic,
        tags: [],
        files: {
            name: templateName,
            content: null,
            isDir: true,
            children: buildTemplateFilesTree(templatePath),
        },
    }

    // console.log(inspect(reqBody, { depth: null }))
    const res = await fetch(`${GO_BACKEND_URL}/api/templates`, {
        method: 'POST',
        headers: {
            'Authorization': `${loadSettings().githubToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    })
    if (!res.ok) {
        p.log.error(`Failed to save template at remote.`)
        return
    }

    p.log.success(`Template saved at remote.`)
}
