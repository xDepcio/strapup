#!/usr/bin/env node

import * as fs from 'fs'
import * as afs from 'node:fs/promises'
import { list, paste, save } from './commandsHandlers.js'
import { scripts } from '../scripts.js'

export const TEMPLATO_DIR_NAME = 'templato'
export const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`
export const WORK_DIR = process.cwd()
export const args = process.argv

async function main() {
    console.log('started headless')
    if (!fs.existsSync(TEMPLATO_DIR_PATH)) {
        await afs.mkdir(`${TEMPLATO_DIR_PATH}/templates`, { recursive: true })
        console.log(`Created ${TEMPLATO_DIR_NAME} directory at ${TEMPLATO_DIR_PATH}`)
    }

    const command = args[2]

    switch (command) {
        case 'run-script': {
            const scriptName = args[3]
            if (!scripts.hasOwnProperty(scriptName)) {
                console.log('Script does not exist')
                return
            }
            // runScript({ scriptName: scriptName as ScriptsNames })
            break
        }
        case 'save': {
            const templateName = args[3]
            const sourceRelativePath = args[4] || '.'

            const flagArgs = args.slice(5)
            const withGitignore = flagArgs.includes('--with-gitignore')

            await save({ sourceRelativePath, templateName, withGitignore })
            break
        }
        case 'paste': {
            const templateName = args[3]
            const destinationRelativePath = args[4] || '.'

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
}


main()
