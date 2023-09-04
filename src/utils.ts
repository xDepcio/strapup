import fs from 'fs'
import { scripts } from './scripts'

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
        const origFilePath = `${fromPath}/${file}`

        const stats = fs.statSync(origFilePath)

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8')

            const writePath = `${toPath}/${file}`

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
