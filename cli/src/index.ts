#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs';
import { dirname } from 'path';
import color from 'picocolors';
import { fileURLToPath } from 'url';
import * as p from './clack-lib/prompts/index.js';
import { list, paste, runScript, save, signIn } from './commandsHandlers.js';
import { SCRIPTS_DIR_PATH, StrapupSettings, TEMPLATES_PATH } from './constants.js';
import { DirectoryNotExists } from './errors.js';
import { downloadScript, escape, getParameterNames, importScripts, initializeStrapupDir, loadSettings, readMetadataFile } from './utils.js';

export const args = process.argv
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(fileURLToPath(import.meta.url));
export const WORK_DIR = process.cwd()

async function main() {
    if (args.length > 2) {
        execSync(`node ${__dirname}/headless/index.js ${args.slice(2).join(' ')}`, { stdio: 'inherit' })
        return
    }
    console.clear();
    p.intro(`${color.bgCyan(color.black(' strapup '))}`);

    let settings: StrapupSettings
    try {
        settings = loadSettings()
    } catch (error) {
        if (error instanceof DirectoryNotExists) {
            p.log.warn(`Strapup directory was not found. Creating one...`)
            await initializeStrapupDir()
        }
    } finally {
        settings = loadSettings()
    }

    p.log.message(`Templates are saved here -> ${color.dim(TEMPLATES_PATH())}`)
    console.log(`${color.gray(p.S_BAR)}  Scripts can be modified and added here -> ${color.dim(SCRIPTS_DIR_PATH)}`)
    console.log(`${color.gray(p.S_BAR)}  And you are here -> ${color.dim(process.cwd())}`)

    const command = await p.select({
        message: 'What do you want to do?',
        options: [
            { value: 'run-script', label: `${color.underline(color.cyan('run-script'))} - run a script.` },
            { value: 'save', label: `${color.underline(color.cyan('save'))} - save a new template.` },
            { value: 'paste', label: `${color.underline(color.cyan('paste'))} - paste saved template.` },
            { value: 'sign-in', label: `${color.underline(color.cyan('sign-in'))} - sign in using Github.` },
            { value: 'list', label: `${color.underline(color.cyan('list'))} - list saved templates.` },
        ],
    })

    switch (command) {
        case 'run-script': {
            const scripts = await importScripts(SCRIPTS_DIR_PATH)
            const options = Object.entries(scripts).map(([name, { description }]) => ({ value: name, label: name, hint: description }))
            const scriptName = await p.selectsearch({
                message: 'What script do you want to run?',
                options: options,
            }) as string

            let script = scripts[scriptName]
            if (!options.map(({ value }) => value).includes(scriptName)) {
                p.log.info(`Script ${color.dim(scriptName)} not found at local machine. Trying to fetch it...`)
                try {
                    await downloadScript(scriptName)
                } catch (error) {
                    p.log.error(`Something went wrong while fetching the script.`)
                    return
                }
                script = await import(`${SCRIPTS_DIR_PATH}/${escape(scriptName)}.mjs`).then(module => module.default)
            }
            else {
                script = scripts[scriptName]
            }
            const scriptParams = getParameterNames(script.command)
            const scriptArguments: string[] = []

            for (const param of scriptParams) {
                const paramValue = await p.text({
                    message: `Provide value for ${param}`,
                    validate: (value) => {
                        if (!value) return 'Please enter a value.'
                    }
                }) as string
                scriptArguments.push(paramValue)
            }

            await runScript({ functionParams: scriptArguments, functionToRun: script.command })
            break
        }
        case 'save': {
            const templateName = await p.text({
                message: 'What should be the name of the template?',
                placeholder: 'my-template',
                validate: (value) => {
                    if (!value) return 'Please enter a name.'
                    if (value.match(/[^(a-zA-Z_\-)]/)?.length) return 'Please enter a valid name.'
                }
            }) as string

            const templateDescription = await p.text({
                message: `Describe your template. ${color.dim("(optional)")}`,
                placeholder: 'Template that spins up something big...',
            }) as string | undefined

            const sourceRelativePaths = (await p.text({
                message: 'Specify relative path (or paths space seperated) to the source directory/file. Directory structure leading to the source will be preserved.',
                initialValue: './',
                validate: (value) => {
                    if (!value) return 'Please enter a path.'
                    for (const path of value.split(' ')) {
                        if (path[0] === '.' && path[1] === '.') return 'Upward traversal is not allowed. Please only use ./'
                        if (path[0] !== '.' && path[1] !== '/') return 'Please enter a relative path.'
                    }
                },
            }) as string).split(' ')

            const flags = await p.multiselect({
                message: 'Select additional options.',
                options: [
                    { value: '--with-gitignore', label: `Ignore files not tracked by git`, hint: 'make sure there is a valid repo.' },
                ],
                required: false,
                initialValues: ['--with-gitignore'],
            }) as string[]

            const withGitignore = flags.includes('--with-gitignore')

            await save({ sourceRelativePaths, templateName, withGitignore, templateDescription })
            break
        }
        case 'paste': {
            const templates = fs.readdirSync(TEMPLATES_PATH()).map(template => {
                const metdata = readMetadataFile(`${TEMPLATES_PATH()}/${template}`)
                return {
                    name: template,
                    description: metdata?.templateDesc
                }
            })
            if (templates.length == 0) {
                p.log.error(`You don't have any templates saved.`)
                return
            }

            const templateName = await p.select({
                message: 'What template do you want to paste?',
                options: templates.map(({ name, description }) => ({ value: name, label: name, hint: description })),
            }) as string

            const destinationRelativePath = await p.text({
                message: 'Where should we paste your template?',
                initialValue: './',
                validate: (value) => {
                    if (!value) return 'Please enter a path.'
                    if (value[0] !== '.') return 'Please enter a relative path.'
                }
            }) as string

            await paste({
                templateName: templateName,
                destinationRelativePath: destinationRelativePath
            })
            break
        }
        case 'sign-in': {
            await signIn()
            break
        }
        case 'list': {
            list()
            break
        }
        default: {
            console.log('Command not found')
            break
        }
    }

    p.outro(`Problems? ${color.underline(color.cyan('https://example.com'))}`);
}

main().catch(console.error);
