import { execSync } from "child_process"
import * as fs from 'fs'
import * as afs from 'node:fs/promises'
import path from "path"
import color from 'picocolors'
import { authorizeDevice } from './auth/device.js'
import * as p from './clack-lib/prompts/index.js'
import { ScriptsFunction, TEMPLATES_PATH } from './constants.js'
import { WORK_DIR } from './index.js'
import { CopyDirectoryContentsParams, copyDirectoryContents, createMetadataFile, getFilesIgnoredByGit, saveSettings, sendTelemetryStats } from "./utils.js"

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
