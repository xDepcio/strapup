#!/usr/bin/env node

import * as p from '@clack/prompts';
import * as fs from 'fs';
import * as afs from 'node:fs/promises';
import color from 'picocolors';
import { searchselect } from './clack/SearchableSelection.js';
import { ScriptsNames, list, paste, runScript, save } from './commandsHandlers.js';
import { scripts } from './scripts.js';

export const TEMPLATO_DIR_NAME = 'templato'
export const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`
export const WORK_DIR = process.cwd()
export const args = process.argv


async function main() {
    if (!fs.existsSync(TEMPLATO_DIR_PATH)) {
        await afs.mkdir(`${TEMPLATO_DIR_PATH}/templates`, { recursive: true })
        console.log(`Created ${TEMPLATO_DIR_NAME} directory at ${TEMPLATO_DIR_PATH}`)
    }

    console.clear();
    p.intro(`${color.bgCyan(color.black(' templato '))}`);

    const command = await p.select({
        message: 'What do you want to do?',
        options: [
            { value: 'run-script', label: `${color.underline(color.cyan('run-script'))} - run a script.` },
            { value: 'save', label: `${color.underline(color.cyan('save'))} - save a new template.` },
            { value: 'paste', label: `${color.underline(color.cyan('paste'))} - paste saved template.` },
            { value: 'list', label: `${color.underline(color.cyan('list'))} - lsit saved templates.` },
        ],
    })

    switch (command) {
        case 'run-script': {
            const scriptName = args[3]
            if (!scripts.hasOwnProperty(scriptName)) {
                console.log('Script does not exist')
                return
            }
            runScript({ scriptName: scriptName as ScriptsNames })
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
                    { value: '--with-gitignore', label: `Don't save files which are in this directory .gitignore`, hint: 'make sure you use templato from correct path.' },
                ],
                required: false,
            }) as string[]

            const withGitignore = flags.includes('--with-gitignore')

            await save({ sourceRelativePath, templateName, withGitignore })
            break
        }
        case 'paste': {
            const templates = fs.readdirSync(`${TEMPLATO_DIR_PATH}/templates`)
            if (templates.length == 0) {
                p.log.error(`You don't have any templates saved.`)
                return
            }

            const templateName = await searchselect({
                message: 'What template do you want to paste?',
                options: templates.map(template => ({ value: template, label: template })),
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
        }
        default: {
            console.log('Command not found')
            break
        }
    }

    p.outro(`Problems? ${color.underline(color.cyan('https://example.com/issues'))}`);
}


main().catch(console.error);