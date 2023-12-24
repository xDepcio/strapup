#!/usr/bin/env node

import { dirname, normalize } from 'path'
import { fileURLToPath } from 'url'
import { paste, runScript } from './commandsHandlers.js'
import { SCRIPTS_PATH, Scripts } from './constants.js'
import { getParameterNames } from './utils.js'

export const STRAPUP_DIR_NAME = 'strapup'
export const STRAPUP_DIR_PATH = `/home/olek/${STRAPUP_DIR_NAME}`
export const WORK_DIR = process.cwd()
export const args = process.argv

export const __dirname = normalize(dirname(fileURLToPath(import.meta.url)) + '/..');

async function main() {
    const command = args[2]

    switch (command) {
        case 'paste': {
            const templateName = args[3]
            const destinationRelativePath = args[4] || '.'

            await paste({
                templateName: templateName,
                destinationRelativePath: destinationRelativePath
            })
            break
        }
        case 'run-script': {
            const scripts: Scripts = await import(SCRIPTS_PATH()).then(module => module.scripts)
            if (!args[3]) {
                throw new Error('No script name provided.')
            }
            const scriptName = args[3]
            const script = scripts[scriptName]
            const scriptParams = getParameterNames(script.command)
            const scriptArguments: string[] = []

            let i = 0
            for (const param of scriptParams) {
                const paramValue = args[4 + i]
                i++
                if (!paramValue) {
                    throw new Error(`No value provided for ${param} parameter.`)
                }
                scriptArguments.push(paramValue)
            }

            await runScript({ functionParams: scriptArguments, functionToRun: script.command })
            break
        }
        default: {
            console.log('Command not found')
            break
        }
    }
}

main()
