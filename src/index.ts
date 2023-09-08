#!/usr/bin/env node
// @ts-nocheck

import * as p from '@clack/prompts';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { dirname, normalize } from 'path';
import color from 'picocolors';
import { fileURLToPath } from 'url';
import { selectsearch } from './clack/styled/SearchableSelect.js';
import { S_BAR } from './clack/styled/utils.js';
import { list, paste, runScript, save } from './commandsHandlers.js';
import { SCRIPTS_PATH, STRAPUP_DIR_NAME, STRAPUP_DIR_PATH_ENV_NAME, Scripts, TEMPLATES_PATH, dirNotSpecifiedStartupWarning, premadeTemplatesDirPath, scriptsContent } from './constants.js';
import { addPremadeTemplatesToExistingTemplatesDir, copyDirectoryContents, getParameterNames, loadSettings, readMetadataFile, saveSettings, setSystemEnv } from './utils.js';

export const args = process.argv

// @ts-ignore
export const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
export const __dirname = dirname(fileURLToPath(import.meta.url));

export const WORK_DIR = process.cwd()

async function main() {
    console.clear();
    p.intro(`${color.bgCyan(color.black(' strapup '))}`);

    const settings = loadSettings()
    settings.strapupDirPath = process.env[STRAPUP_DIR_PATH_ENV_NAME] || settings.strapupDirPath
    saveSettings(settings)
    if (!settings.strapupDirPath || true) {
        p.log.warn(dirNotSpecifiedStartupWarning)
        const providedPath = await p.text({
            message: 'Specify absolute path where to save strapup files.',
            validate: (value) => {
                if (!value) return 'Please enter a path.'
                if (!fs.existsSync(value)) return 'Directory does not exist.'
                try {
                    fs.accessSync(value, fs.constants.R_OK | fs.constants.W_OK);
                } catch (err) {
                    return 'Specified directory is read/write protected.'
                }
            },
            initialValue: process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME,
        }) as string
        settings.strapupDirPath = normalize(providedPath + '/' + STRAPUP_DIR_NAME)
        saveSettings(settings)
        setSystemEnv(STRAPUP_DIR_PATH_ENV_NAME, settings.strapupDirPath)

        try {
            fs.mkdirSync(settings.strapupDirPath)
            p.log.info(`Created strapup directory at ${color.dim(normalize(settings.strapupDirPath))}`)
        } catch (e: any) {
            if (e.code === "EEXIST") {
                p.log.info(`Existing strapup directory found at ${color.dim(normalize(settings.strapupDirPath))}`)
            }
            else throw e
        }

        try {
            fs.mkdirSync(TEMPLATES_PATH())
            copyDirectoryContents({ fromPath: premadeTemplatesDirPath(), toPath: TEMPLATES_PATH(), skipMetadataFile: false })
            p.log.info(`Created templates directory at ${color.dim(TEMPLATES_PATH())}`)
        } catch (e: any) {
            if (e.code === "EEXIST") {
                p.log.info(`Existing templates directory found at ${color.dim(TEMPLATES_PATH())}`)
                p.log.message(`Syncing premade templates...`)
                addPremadeTemplatesToExistingTemplatesDir(TEMPLATES_PATH())
            }
            else throw e
        }

        if (fs.existsSync(SCRIPTS_PATH())) {
            p.log.info(`Existing scripts file found at ${color.dim(SCRIPTS_PATH())}`)
        }
        else {
            fs.writeFileSync(SCRIPTS_PATH(), scriptsContent, { encoding: 'utf-8' })
            p.log.info(`Created scripts file at ${color.dim(SCRIPTS_PATH())}`)
        }
    }

    if (!fs.existsSync(settings.strapupDirPath)) {
        p.log.error(`Strapup directory does not exist at ${color.dim(settings.strapupDirPath)}.`)
        return
    }

    if (args.length > 2) {
        execSync(`node ${__dirname}/headless/index.js ${args.slice(2).join(' ')}`, { stdio: 'inherit' })
        return
    }

    p.log.message(`Templates are saved here -> ${color.dim(TEMPLATES_PATH())}`)
    console.log(`${color.gray(S_BAR)}  Scripts can be modified and added here -> ${color.dim(SCRIPTS_PATH())}`)
    console.log(`${color.gray(S_BAR)}  And you are here -> ${color.dim(process.cwd())}`)

    const command = await p.select({
        message: 'What do you want to do?',
        options: [
            { value: 'run-script', label: `${color.underline(color.cyan('run-script'))} - run a script.` },
            { value: 'save', label: `${color.underline(color.cyan('save'))} - save a new template.` },
            { value: 'paste', label: `${color.underline(color.cyan('paste'))} - paste saved template.` },
            { value: 'list', label: `${color.underline(color.cyan('list'))} - list saved templates.` },
        ],
    })

    switch (command) {
        case 'run-script': {
            const scripts: Scripts = await import(SCRIPTS_PATH()).then(module => module.scripts)
            const scriptName = await selectsearch({
                searchPlaceholder: 'Search to narrow results.',
                message: 'What script do you want to run?',
                options: Object.entries(scripts).map(([name, { description }]) => ({ value: name, label: name, hint: description })),
            }) as string
            const script = scripts[scriptName]
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

            const sourceRelativePath = await p.text({
                message: 'Specify relative path to the source directory.',
                initialValue: './',
                validate: (value) => {
                    if (!value) return 'Please enter a path.'
                    if (value[0] !== '.') return 'Please enter a relative path.'
                },
            }) as string

            const flags = await p.multiselect({
                message: 'Select additional options.',
                options: [
                    { value: '--with-gitignore', label: `Ignore files not tracked by git`, hint: 'make sure there is a valid repo.' },
                ],
                required: false,
                initialValues: ['--with-gitignore'],
            }) as string[]

            const withGitignore = flags.includes('--with-gitignore')

            await save({ sourceRelativePath, templateName, withGitignore, templateDescription })
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

            paste({
                templateName: templateName,
                destinationRelativePath: destinationRelativePath
            })
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

    p.outro(`Problems? ${color.underline(color.cyan('https://github.com/xDepcio/strapup'))}`);
}


main().catch(console.error);
