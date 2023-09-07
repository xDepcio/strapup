import * as p from '@clack/prompts'
import { execSync } from "child_process"
import * as fs from 'fs'
import * as afs from 'node:fs/promises'
import path from "path"
import color from 'picocolors'
import { CopyDirectoryContentsParams, copyDirectoryContents, getFilesIgnoredByGit } from "./utils.js"
import { S_BAR } from './clack/styled/utils.js'
import { WORK_DIR } from './index.js'
import { ScriptsFunction, TEMPLATES_PATH } from './constants.js'

interface SaveOptions {
    templateName: string
    sourceRelativePath: string
    withGitignore: boolean
    templateDescsription?: string
}

export async function save({ templateName, sourceRelativePath, withGitignore, templateDescsription }: SaveOptions) {
    const templatePath = `${TEMPLATES_PATH()}/${templateName}`
    const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`
    const copyArgs: CopyDirectoryContentsParams = {
        fromPath: sourceAbsolutePath,
        toPath: templatePath,
    }

    if (!fs.existsSync(sourceAbsolutePath)) {
        p.log.error(`Directory specified as source: ${sourceAbsolutePath} does not exist`)
        return
    }

    let override = false
    if (fs.existsSync(templatePath)) {
        override = await p.confirm({
            message: `Template ${templateName} already exists. Override It?`,
            initialValue: false
        }) as boolean

        if (override) fs.rmSync(templatePath, { recursive: true, force: true })
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

    if (!fs.existsSync(templatePath) || override) {
        await afs.mkdir(templatePath, { recursive: true })

        copyDirectoryContents(copyArgs)
        p.log.success(`Saved ${color.cyan(templateName)} template at ${color.dim(templatePath)}`)
    }
    else {
        p.log.error(`Aborted saving ${color.cyan(templateName)} template.`)
    }
}


interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export function paste({ templateName, destinationRelativePath }: PasteOptions) {
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

    copyDirectoryContents({ fromPath: templatePath, toPath: destinationAbsolutePath })
    p.log.success(`Pasted ${templateName} template to ${color.dim(destinationAbsolutePath)}`)
}


export function list() {
    const templates = fs.readdirSync(TEMPLATES_PATH())

    if (templates.length === 0) {
        p.log.warn(`You don't have any saved templates.`)
        return
    }

    p.log.success(`Your templates:`)
    templates.forEach(template => {
        console.log(`${color.gray(S_BAR)}  ${color.dim(template)}`)
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
        console.log(`${color.gray(S_BAR)}  ${color.green(command)}`)
    })

    execSync(concatedCommands, { stdio: 'inherit' })

    p.log.success(`Script ${functionToRun.name} finished successfully.`)
}
