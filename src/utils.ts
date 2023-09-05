import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

export const copyDirectoryContents = (
    fromPath: string,
    toPath: string,
    options: {
        validate: ({ createName, createPath, sourcePath, isFile }:
            { createName: string, createPath: string, sourcePath: string, isFile: boolean }) => boolean
    } = { validate: () => true }
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

            fs.writeFileSync(writePath, contents, 'utf8')
        }
        else if (stats.isDirectory()) {
            if (!options.validate({ createName: file, createPath: `${toPath}/${file}`, isFile: false, sourcePath: origFilePath })) {
                return
            }

            fs.mkdirSync(`${toPath}/${file}`)
            copyDirectoryContents(`${toPath}/${file}`, `${fromPath}/${file}`)
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
