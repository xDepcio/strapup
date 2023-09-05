import * as p from '@clack/prompts'
import { execSync } from "child_process"
import * as fs from 'fs'
import ignore from "ignore"
import * as afs from 'node:fs/promises'
import path from "path"
import { TEMPLATO_DIR_PATH, WORK_DIR } from "./index.js"
import { scripts } from "./scripts.js"
import { copyDirectoryContents, getFilesIgnoredByGit } from "./utils.js"
import { S_BAR, S_BAR_END, S_BAR_START } from './clack/SearchableSelection.js'
import color from 'picocolors'

interface SaveOptions {
    templateName: string
    sourceRelativePath: string
    withGitignore: boolean
}

export async function save({ templateName, sourceRelativePath, withGitignore }: SaveOptions) {
    const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`
    const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`

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
        fs.rmSync(templatePath, { recursive: true, force: true })
    }

    if (!fs.existsSync(templatePath) || override) {
        await afs.mkdir(templatePath, { recursive: true })

        if (withGitignore) {
            let files: string[] = []
            try {
                files = await getFilesIgnoredByGit()
            } catch (e) {
                p.log.warn(`Problem with checking git files: ${color.dim((e as Error).message)}`)
            }
            copyDirectoryContents(sourceAbsolutePath, templatePath, {
                validate: ({ createName, createPath, isFile, sourcePath }) => {
                    if (files.includes(createName)) {
                        p.log.info(`${color.dim(createName)} ignored by git. Skipping It...`)
                        return false
                    }
                    return true
                }
            })

            p.log.success(`Saved ${color.cyan(templateName)} template at ${color.dim(templatePath)}`)
        }
        else {
            copyDirectoryContents(sourceAbsolutePath, templatePath)
            p.log.success(`Saved ${color.cyan(templateName)} template at ${color.dim(templatePath)}`)
        }
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
    const templatePath = path.normalize(`${TEMPLATO_DIR_PATH}/templates/${templateName}`)
    const destinationAbsolutePath = path.normalize(`${WORK_DIR}/${destinationRelativePath}`)

    if (!fs.existsSync(templatePath)) {
        p.log.error(`Template ${templateName} does not exist. Aborting.`)
        return
    }

    if (!fs.existsSync(destinationAbsolutePath)) {
        fs.mkdirSync(destinationAbsolutePath, { recursive: true })
        p.log.info(`Directory ${color.dim(destinationAbsolutePath)} does not exists. Creating it...`)
    }

    copyDirectoryContents(templatePath, destinationAbsolutePath)
    p.log.success(`Pasted ${templateName} template to ${color.dim(destinationAbsolutePath)}`)
}


export function list() {
    const templates = fs.readdirSync(`${TEMPLATO_DIR_PATH}/templates`)

    if (templates.length === 0) {
        p.log.warn(`You don't have any saved templates.`)
        return
    }

    p.log.success(`Your templates:`)
    templates.forEach(template => {
        console.log(`${color.gray(S_BAR)}  ${color.dim(template)}`)
    })
}

export type ScriptsFunctions = typeof scripts[keyof typeof scripts]
export type ScriptsNames = keyof typeof scripts

interface RunScriptOptions {
    functionToRun: ScriptsFunctions
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
