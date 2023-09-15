import * as p from '@clack/prompts'
import fs from 'fs'
import path from 'path'
import color from 'picocolors'
import { StrapupSettings, inintialSettings, statsUrl } from './constants.js'
import { __dirname } from './index.js'
import fetch from 'node-fetch'

export interface CopyDirectoryContentsParams {
    fromPath: string
    toPath: string
    validate?: ({ createName, createPath, sourcePath, isFile }: { createName: string, createPath: string, sourcePath: string, isFile: boolean }) => boolean
    overwriteFiles?: boolean
    skipMetadataFile?: boolean
}

export const copyDirectoryContents = ({ fromPath, toPath, validate = () => true, overwriteFiles = true, skipMetadataFile = true }: CopyDirectoryContentsParams) => {
    const filesToCreate = fs.readdirSync(fromPath)

    filesToCreate.forEach(file => {
        const origFilePath = path.normalize(`${fromPath}/${file}`)

        const stats = fs.statSync(origFilePath)

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8')

            const writePath = path.normalize(`${toPath}/${file}`)

            if (!validate({ createName: file, createPath: writePath, isFile: true, sourcePath: origFilePath })) {
                return
            }

            if (file === '_strapupmetadata.json' && skipMetadataFile) {
                return
            }

            if (!fs.existsSync(writePath)) {
                fs.writeFileSync(writePath, contents, 'utf8')
                return
            }
            if (overwriteFiles) {
                fs.writeFileSync(writePath, contents, 'utf8')
                p.log.info(`Overwriting ${color.dim(file)}`)
                return
            }
            p.log.info(`Skipping ${color.dim(file)}. File already exists.`)
        }
        else if (stats.isDirectory()) {
            if (!validate({ createName: file, createPath: `${toPath}/${file}`, isFile: false, sourcePath: origFilePath })) {
                return
            }

            try {
                fs.mkdirSync(`${toPath}/${file}`)
                copyDirectoryContents({ fromPath: `${fromPath}/${file}`, toPath: `${toPath}/${file}`, overwriteFiles, validate, skipMetadataFile })
            } catch (e: any) {
                if (e.code === 'EEXIST') {
                    copyDirectoryContents({ fromPath: `${fromPath}/${file}`, toPath: `${toPath}/${file}`, overwriteFiles, validate, skipMetadataFile })
                }
            }
        }
    })
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
