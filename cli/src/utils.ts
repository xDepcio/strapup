import { spawn } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'
import path, { basename } from 'path'
import color from 'picocolors'
import * as p from "./clack-lib/prompts/index.js"
import { S_BAR } from './clack-lib/prompts/index.js'
import { EXAMPLE_SCRIPT_PATH, GO_BACKEND_URL, MAIN_SCRIPT_PATH, SCRIPTS_DIR_PATH, SETTINGS_PATH, STRAPUP_DIR_PATH, Scripts, StrapupSettings, TEMPLATES_PATH, exampleScriptContent, inintialSettings, premadeTemplatesDirPath, scriptsContent, statsUrl } from './constants.js'
import { DirectoryNotExists } from './errors.js'
import { __dirname } from './index.js'
// import { S_BAR } from './clack/styled/utils.js'

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

export function getParameterNames(func: Function) {
    const funcString = func.toString();
    const parameterNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .split(',')
        .map((param) => param.trim());
    return parameterNames.filter(Boolean)
}

export const getFilesIgnoredByGit = (dir: string = './') => {
    const shell = spawn('git', ['ls-files', '-o', '--directory'], { stdio: 'pipe', cwd: dir })
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
    if (!fs.existsSync(STRAPUP_DIR_PATH)) {
        throw new DirectoryNotExists(STRAPUP_DIR_PATH)
    }

    const file = fs.readFileSync(STRAPUP_DIR_PATH + '/.settings.json', { encoding: 'utf-8' })

    return JSON.parse(file) as StrapupSettings

    // if (!fs.existsSync(__dirname + '/settings.json')) {
    //     fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(inintialSettings, null, 4), { encoding: 'utf-8' })
    // }
    // return JSON.parse(fs.readFileSync(__dirname + '/settings.json', { encoding: 'utf-8' })) as StrapupSettings
}
export const saveSettings = (settings: Partial<StrapupSettings>) => {
    const currentSettings = loadSettings()
    const newSettings = { ...currentSettings, ...settings }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 4), { encoding: 'utf-8' })
}

export type Metadata = {
    templateDesc?: string
}

export type CreateMetadataFileParams = {
    directoryPath: string
} & Metadata

export const createMetadataFile = ({ directoryPath, templateDesc = '' }: CreateMetadataFileParams) => {
    const metadata: Metadata = {
        templateDesc: templateDesc,
    }
    fs.writeFileSync(`${directoryPath}/_strapupmetadata.json`, JSON.stringify(metadata, null, 4), { encoding: 'utf-8' })
}

export const readMetadataFile = (directoryPath: string) => {
    if (!fs.existsSync(`${directoryPath}/_strapupmetadata.json`)) return null
    return JSON.parse(fs.readFileSync(`${directoryPath}/_strapupmetadata.json`, { encoding: 'utf-8' })) as Metadata
}

// export const setSystemEnv = (key: string, value: string) => {
//     if (process.platform === 'win32') {
//         spawnSync('setx', [key, value], { stdio: 'inherit' })
//     }
//     else if (process.platform === 'linux' || process.platform === 'darwin') {
//         let bashrcContent = fs.readFileSync(`${process.env.HOME}/.bashrc`, { encoding: 'utf-8' })
//         if (bashrcContent.includes(`export ${key}=`)) {
//             const regex = new RegExp(`export ${key}=(.*)`, 'g')
//             bashrcContent = bashrcContent.replace(regex, `export ${key}=${value}`)
//             fs.writeFileSync(`${process.env.HOME}/.bashrc`, bashrcContent, { encoding: 'utf-8' })
//         }
//         else {
//             fs.appendFileSync(`${process.env.HOME}/.bashrc`, `\nexport ${key}=${value}`, { encoding: 'utf-8' })
//         }
//     }
//     else {
//         throw new Error('Unsupported platform: ' + process.platform)
//     }
// }

export const addPremadeTemplatesToExistingTemplatesDir = async (existingDirPath: string) => {
    const templatesPath = `${__dirname}/premade-templates`
    const templates = fs.readdirSync(templatesPath)
    for (const template of templates) {
        fs.rmSync(`${existingDirPath}/${template}`, { recursive: true, force: true })
        fs.mkdirSync(`${existingDirPath}/${template}`, { recursive: true })
        const templatePath = path.normalize(`${templatesPath}/${template}`)
        await copyDirectoryContents({ fromPath: templatePath, toPath: `${existingDirPath}/${template}`, forceOverwriteFiles: false, skipMetadataFile: false })
    }
}

export async function initializeStrapupDir() {
    fs.mkdirSync(STRAPUP_DIR_PATH)
    fs.mkdirSync(TEMPLATES_PATH())
    fs.mkdirSync(SCRIPTS_DIR_PATH)
    fs.writeFileSync(MAIN_SCRIPT_PATH, scriptsContent, { encoding: 'utf-8' })
    fs.writeFileSync(EXAMPLE_SCRIPT_PATH, exampleScriptContent, { encoding: 'utf-8' })
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(inintialSettings, null, 4), { encoding: 'utf-8' })

    await copyDirectoryContents({ fromPath: premadeTemplatesDirPath(), toPath: TEMPLATES_PATH(), skipMetadataFile: false })
}

export async function downloadScript(scriptName: string) {
    const res = await fetch(`${GO_BACKEND_URL}/api/scripts/?name=${scriptName}`, {
        headers: {
            "Authorization": loadSettings().githubToken || ''
        }
    })
    if (!res.ok) {
        throw new Error(scriptName)
    }
    const scriptContent = await res.text()
    // const scriptContent = `export default {
    //     description: "Example script",
    //     command: (animal, food) => [
    //         \`echo "\${animal} eats \${food}"\`
    //     ]
    // }` // This is dummy response
    fs.writeFileSync(`${SCRIPTS_DIR_PATH}/${escape(scriptName)}.mjs`, scriptContent, { encoding: 'utf-8' })
}

export function escape(fileName: string) {
    return fileName.replace(/\//g, '_-_')
}

export function unEscape(fileName: string) {
    return fileName.replace(/_-_/g, '/')
}

/**
 *
 * @param name - name of template/script in format: @user/name or name
 * @returns - { user: a user part, name: a script/template name part }
 * @throws - Error when name is invalid
 */
export function parseName(name: string) {
    const splitted = name.split('/')
    if (splitted.length == 1) {
        return {
            user: null,
            name: splitted[0]
        }
    }
    if (splitted.length == 2 && splitted[0].startsWith('@')) {
        return {
            user: splitted[0],
            name: splitted[1]
        }
    }
    throw new Error('Invalid name')
}

// /**
//  * Creates strapup directory at specified path if it doesn't exist. Or is responsible for syncing premade templates and scripts file, when it exists.
//  * @param dirPath - absolute path to strapup directory contents (.../strapup)
//  */
// export const createStrapupDirectory = async (dirPath: string) => {
//     try {
//         fs.mkdirSync(dirPath)
//         p.log.info(`Created strapup directory at ${color.dim(normalize(dirPath))}`)
//     } catch (e: any) {
//         if (e.code === "EEXIST") {
//             p.log.info(`Existing strapup directory found at ${color.dim(normalize(dirPath))}`)
//         }
//         else throw e
//     }

//     try {
//         fs.mkdirSync(TEMPLATES_PATH())
//         await copyDirectoryContents({ fromPath: premadeTemplatesDirPath(), toPath: TEMPLATES_PATH(), skipMetadataFile: false })
//         p.log.info(`Created templates directory at ${color.dim(TEMPLATES_PATH())}`)
//     } catch (e: any) {
//         if (e.code === "EEXIST") {
//             p.log.info(`Existing templates directory found at ${color.dim(TEMPLATES_PATH())}`)
//             p.log.message(`Syncing premade templates...`)
//             await addPremadeTemplatesToExistingTemplatesDir(TEMPLATES_PATH())
//         }
//         else throw e
//     }

//     if (fs.existsSync(SCRIPTS_PATH())) {
//         p.log.info(`Existing scripts file found at ${color.dim(SCRIPTS_PATH())}`)
//     }
//     else {
//         fs.writeFileSync(SCRIPTS_PATH(), scriptsContent, { encoding: 'utf-8' })
//         p.log.info(`Created scripts file at ${color.dim(SCRIPTS_PATH())}`)
//     }
// }

export async function importScripts(path: string) {
    const mainScripts = await import(MAIN_SCRIPT_PATH).then(module => module.scripts) as Scripts

    const customScripts: Scripts = {}
    const files = fs.readdirSync(path)
    for (const file of files) {
        if (file === basename(MAIN_SCRIPT_PATH)) continue
        const scriptContent = await import(`${path}/${file}`).then(module => module.default)

        const unEscapedFileNameNoExt = file.replace(/\.[^/.]+$/, "").replace("_-_", "/")
        customScripts[unEscapedFileNameNoExt] = scriptContent
    }

    return { ...mainScripts, ...customScripts }
}

export type TelemetryStat = "templateSaved" | "templatePasted" | "scriptRan"

export const sendTelemetryStats = async (stat: TelemetryStat) => {
    const res = await fetch(`${statsUrl}/api/stats`, {
        method: 'POST',
        body: JSON.stringify({ stat }),
    })
}

export const pLog = {
    message: (str: string) => console.log(`${color.gray(S_BAR)}  ${str}`)
}

export const walkDir = (dir: string, callback: (path: string) => void, recursive: boolean = false) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const filePath = path.normalize(`${dir}/${file}`)
        const stats = fs.statSync(filePath)
        if (stats.isFile()) {
            callback(filePath)
        }
        else if (recursive && stats.isDirectory()) {
            walkDir(filePath, callback)
        }
    }
}

export function outroStrapup(my_headless: boolean) 
{
    if(!my_headless)
    {
        p.outro(`Problems? ${color.underline(color.cyan('https://example.com'))}`);
    }
}
