// import * as p from '@clack/prompts'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import color from 'picocolors'
import * as p from '../clack-lib/prompts/index.js'
import { StrapupSettings, inintialSettings, statsUrl } from './constants.js'
import { __dirname } from './index.js'

export interface CopyDirectoryContentsParams {
    fromPath: string
    toPath: string
    validate?: ({ createName, createPath, sourcePath, isFile }: { createName: string, createPath: string, sourcePath: string, isFile: boolean }) => boolean
    forceOverwriteFiles?: boolean
    skipMetadataFile?: boolean
}

export const copyDirectoryContents = async ({ fromPath, toPath, validate = () => true, forceOverwriteFiles = false, skipMetadataFile = true }: CopyDirectoryContentsParams) => {
    const filesToCreate = fs.readdirSync(fromPath)

    for (const file of filesToCreate) {
        // filesToCreate.forEach(file => {
        const origFilePath = path.normalize(`${fromPath}/${file}`)

        const stats = fs.statSync(origFilePath)

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8')

            const writePath = path.normalize(`${toPath}/${file}`)

            if (!validate({ createName: file, createPath: writePath, isFile: true, sourcePath: origFilePath })) {
                continue
            }

            if (file === '_strapupmetadata.json' && skipMetadataFile) {
                continue
            }

            if (!fs.existsSync(writePath)) {
                fs.writeFileSync(writePath, contents, 'utf8')
                continue
            }
            const overwrite = await p.select({
                message: `File ${color.dim(file)} already exists.`,
                options: [
                    { label: 'Overwrite It', value: 'overwrite' },
                    { label: 'Skip It', value: 'skip' },
                    { label: 'Create shadow', value: 'shadow', hint: 'Both creates new and leaves original file untouched, to resolve conflicts manually.' },
                ],
            }) as 'overwrite' | 'skip' | 'shadow'
            if (forceOverwriteFiles || overwrite === 'overwrite') {
                fs.writeFileSync(writePath, contents, 'utf8')
                p.log.info(`Overwriting ${color.dim(file)}`)
                continue
            }
            if (overwrite === 'shadow') {
                const shadowWritePath = path.normalize(`${toPath}/shadow-${file}`)
                fs.writeFileSync(shadowWritePath, contents, 'utf8')
                p.log.info(`Created shadow ${color.dim(file)}`)
                continue
            }
            p.log.info(`Skipping ${color.dim(file)}. File already exists.`)
        }
        else if (stats.isDirectory()) {
            if (!validate({ createName: file, createPath: `${toPath}/${file}`, isFile: false, sourcePath: origFilePath })) {
                continue
            }

            try {
                fs.mkdirSync(`${toPath}/${file}`)
                await copyDirectoryContents({ fromPath: `${fromPath}/${file}`, toPath: `${toPath}/${file}`, forceOverwriteFiles, validate, skipMetadataFile })
            } catch (e: any) {
                if (e.code === 'EEXIST') {
                    await copyDirectoryContents({ fromPath: `${fromPath}/${file}`, toPath: `${toPath}/${file}`, forceOverwriteFiles, validate, skipMetadataFile })
                }
            }
        }
    }
}

export type TelemetryStat = "templateSaved" | "templatePasted" | "scriptRan"

export const sendTelemetryStats = async (stat: TelemetryStat) => {
    const res = await fetch(`${statsUrl}/api/stats`, {
        method: 'POST',
        body: JSON.stringify({ stat }),
    })
}

export const loadSettings = () => {
    if (!fs.existsSync(__dirname + '/settings.json')) {
        fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(inintialSettings, null, 4), { encoding: 'utf-8' })
    }
    return JSON.parse(fs.readFileSync(__dirname + '/settings.json', { encoding: 'utf-8' })) as StrapupSettings
}

export function getParameterNames(func: Function) {
    const funcString = func.toString();
    const parameterNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .split(',')
        .map((param) => param.trim());
    return parameterNames.filter(Boolean); // Removes empty strings
}
