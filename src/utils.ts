import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { __dirname } from './index.js'
import { StrapupSettings, inintialSettings } from './constants.js'
import * as p from '@clack/prompts'
import color from 'picocolors'

export const copyDirectoryContents = (
    fromPath: string,
    toPath: string,
    options: {
        validate: ({ createName, createPath, sourcePath, isFile }:
            { createName: string, createPath: string, sourcePath: string, isFile: boolean }) => boolean
        overwriteFiles?: boolean
    } = { validate: () => true, overwriteFiles: true }
) => {
    const filesToCreate = fs.readdirSync(fromPath)

    filesToCreate.forEach(file => {
        const origFilePath = path.normalize(`${fromPath}/${file}`)

        const stats = fs.statSync(origFilePath)

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8')

            const writePath = path.normalize(`${toPath}/${file}`)

            if (!options.validate({ createName: file, createPath: writePath, isFile: true, sourcePath: origFilePath })) {
                return
            }

            if (!fs.existsSync(writePath)) {
                fs.writeFileSync(writePath, contents, 'utf8')
                return
            }
            if (options.overwriteFiles) {
                fs.writeFileSync(writePath, contents, 'utf8')
                p.log.info(`Overwriting ${color.dim(file)}`)
                return
            }
            p.log.info(`Skipping ${color.dim(file)}. File already exists.`)
        }
        else if (stats.isDirectory()) {
            if (!options.validate({ createName: file, createPath: `${toPath}/${file}`, isFile: false, sourcePath: origFilePath })) {
                return
            }

            try {
                fs.mkdirSync(`${toPath}/${file}`)
                copyDirectoryContents(`${fromPath}/${file}`, `${toPath}/${file}`)
            } catch (e: any) {
                if (e.code === 'EEXIST') {
                    copyDirectoryContents(`${fromPath}/${file}`, `${toPath}/${file}`)
                }
            }
        }
    })
}

export function getParameterNames(func: Function) {
    const funcString = func.toString();
    const parameterNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .split(',')
        .map((param) => param.trim());
    return parameterNames.filter(Boolean); // Removes empty strings
}

export const getFilesIgnoredByGit = () => {
    const shell = spawn('git', ['ls-files', '-o', '--directory'], { stdio: 'pipe' })
    const ignoredAdditionaly = ['.git']
    return new Promise<string[]>((resolve, reject) => {
        let result = ''
        shell.stdout.on('data', (data) => {
            result = data.toString()
        })
        shell.stderr.on('data', (data) => {
            reject(new Error(data.toString()))
        })
        shell.on('close', () => {
            const results = result.trim().split('\n').map(file => file.replace(/\//g, '')).concat(ignoredAdditionaly)
            resolve(results)
        })
    })
}

export const loadSettings = () => {
    if (!fs.existsSync(__dirname + '/settings.json')) {
        fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(inintialSettings, null, 4), { encoding: 'utf-8' })
    }
    return JSON.parse(fs.readFileSync(__dirname + '/settings.json', { encoding: 'utf-8' })) as StrapupSettings
}

export const saveSettings = (settings: StrapupSettings) => {
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4), { encoding: 'utf-8' })
}
