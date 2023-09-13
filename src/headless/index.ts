#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { paste } from './commandsHandlers.js'
import { dirname, normalize } from 'path'

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

            paste({
                templateName: templateName,
                destinationRelativePath: destinationRelativePath
            })
            break
        }
        default: {
            console.log('Command not found')
            break
        }
    }
}

main()
