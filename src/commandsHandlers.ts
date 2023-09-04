import ignore from "ignore"
import { TEMPLATO_DIR_PATH, WORK_DIR, args } from "./index.js"
import * as fs from 'fs'
import { copyDirectoryContents, getParameterNames } from "./utils.js"
import path from "path"
import * as afs from 'node:fs/promises'
import { scripts } from "./scripts.js"
import { inspect } from "util"
import { execSync } from "child_process"
import * as p from '@clack/prompts';

interface SaveOptions {
    templateName: string
    sourceRelativePath: string
    withGitignore: boolean
}

export async function save({ templateName, sourceRelativePath, withGitignore }: SaveOptions) {
    console.log('Saving template...')

    const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`
    const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`

    if (!fs.existsSync(sourceAbsolutePath)) {
        console.log(`Directory specified as source: ${sourceAbsolutePath} does not exist`)
        return
    }

    if (!fs.existsSync(templatePath)) {
        await afs.mkdir(templatePath, { recursive: true })

        if (withGitignore) {
            const gitignorePath = `${sourceAbsolutePath}/.gitignore`
            if (!fs.existsSync(gitignorePath)) {
                console.log(`No .gitignore found in ${sourceAbsolutePath}`)
                return
            }

            const gitignoreContents = fs.readFileSync(gitignorePath, 'utf8')
            const gitignore = ignore().add(gitignoreContents)
            gitignore.add('.git')
            gitignore.add('.gitignore')

            copyDirectoryContents(sourceAbsolutePath, templatePath, {
                validate: ({ createName, createPath, isFile, sourcePath }) => {
                    const relPath = path.relative(sourceAbsolutePath, sourcePath)
                    const ignores = gitignore.ignores(relPath + (isFile ? '' : '/'))

                    if (ignores) {
                        console.log(`File ${sourcePath} ignored (--with-gitignore)`)
                        return false
                    }
                    return true
                }
            })
        }
        else {
            copyDirectoryContents(sourceAbsolutePath, templatePath)
            console.log(`Saved ${templateName} template at ${templatePath}`)
        }
    }
    else {
        console.log(`Template ${templateName} already exists`)
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


export type ScriptsNames = keyof typeof scripts
interface RunScriptOptions {
    scriptName: ScriptsNames
}

export function runScript({ scriptName }: RunScriptOptions) {
    console.log(`Running script ${scriptName}...`)
    const scriptParams = args.slice(4)
    const script = scripts[scriptName]

    if (script.length !== scriptParams.length) {
        console.log(`Script ${scriptName} requires ${script.length} parameters, but ${scriptParams.length} were provided`)
        const params = getParameterNames(script)
        console.log(`Parameters needed: ${params.join(', ')}`)
        return
    }
    // @ts-ignore length checked above
    const commands = script(...scriptParams)
    const concatedCommands = commands.join('\n')
    execSync(concatedCommands, { stdio: 'inherit' })
}
