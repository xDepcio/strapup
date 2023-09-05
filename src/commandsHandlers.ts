import * as p from '@clack/prompts'
import { execSync } from "child_process"
import * as fs from 'fs'
import ignore from "ignore"
import * as afs from 'node:fs/promises'
import path from "path"
import { TEMPLATO_DIR_PATH, WORK_DIR } from "./index.js"
import { scripts } from "./scripts.js"
import { copyDirectoryContents } from "./utils.js"
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
            const gitignorePath = `${sourceAbsolutePath}/.gitignore`
            if (fs.existsSync(gitignorePath)) {
                const gitignoreContents = fs.readFileSync(gitignorePath, 'utf8')
                const gitignore = ignore().add(gitignoreContents)
                gitignore.add('.git')
                gitignore.add('.gitignore')

                copyDirectoryContents(sourceAbsolutePath, templatePath, {
                    validate: ({ createName, createPath, isFile, sourcePath }) => {
                        const relPath = path.relative(sourceAbsolutePath, sourcePath)
                        const ignores = gitignore.ignores(relPath + (isFile ? '' : '/'))

                        if (ignores) {
                            const normalizedSrcPath = path.normalize(sourcePath)
                            const isFile = fs.statSync(normalizedSrcPath).isFile()
                            p.log.info(`${isFile ? 'File' : 'Directory'} at ${color.dim(normalizedSrcPath)} ignored by .gitignore`)
                            return false
                        }
                        return true
                    }
                })
                p.log.success(`Saved ${templateName} template at ${color.dim(templatePath)}`)
            }
            else {
                p.log.warn(`No .gitignore found in ${sourceAbsolutePath}`)
                copyDirectoryContents(sourceAbsolutePath, templatePath)
                p.log.success(`Saved ${templateName} template at ${color.dim(templatePath)}`)
            }
        }
        else {
            copyDirectoryContents(sourceAbsolutePath, templatePath)
            p.log.success(`Saved ${templateName} template at ${color.dim(templatePath)}`)
        }
    }
    else {
        p.log.error(`Aborted saving ${templateName} template.`)
    }
}


interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export function paste({ templateName, destinationRelativePath }: PasteOptions) {
    p.log.message(`Pasting template...`)

    const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`
    const destinationAbsolutePath = `${WORK_DIR}/${destinationRelativePath}`

    if (!fs.existsSync(templatePath)) {
        p.log.error(`Template ${templateName} does not exist`)
        return
    }

    if (!fs.existsSync(destinationAbsolutePath)) {
        fs.mkdirSync(destinationAbsolutePath, { recursive: true })
        p.log.info(`Directory ${destinationAbsolutePath} does not exists. Creating it...`)
    }

    copyDirectoryContents(templatePath, destinationAbsolutePath)
    p.log.success(`Pasted ${templateName} template to ${destinationAbsolutePath}`)
}


export function list() {
    console.log('Listing templates...')

    const templates = fs.readdirSync(`${TEMPLATO_DIR_PATH}/templates`)

    if (templates.length === 0) {
        console.log('No templates found')
        return
    }

    console.log('Templates:')
    templates.forEach(template => {
        console.log(template)
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
