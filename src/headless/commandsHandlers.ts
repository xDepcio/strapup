import * as p from '@clack/prompts'
import { execSync } from "child_process"
import * as fs from 'fs'
// import ignore from "ignore"
import * as afs from 'node:fs/promises'
import path from "path"
import { STRAPUP_DIR_PATH, WORK_DIR } from "./index.js"
import { scripts } from "../scripts.js"
import { copyDirectoryContents } from "../utils.js"

interface SaveOptions {
    templateName: string
    sourceRelativePath: string
    withGitignore: boolean
}

export async function save({ templateName, sourceRelativePath, withGitignore }: SaveOptions) {
    // console.log('Saving template...')

    // const templatePath = `${STRAPUP_DIR_PATH}/templates/${templateName}`
    // const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`

    // if (!fs.existsSync(sourceAbsolutePath)) {
    //     console.log(`Directory specified as source: ${sourceAbsolutePath} does not exist`)
    //     return
    // }

    // if (!fs.existsSync(templatePath)) {
    //     await afs.mkdir(templatePath, { recursive: true })

    //     if (withGitignore) {
    //         const gitignorePath = `${sourceAbsolutePath}/.gitignore`
    //         if (!fs.existsSync(gitignorePath)) {
    //             console.log(`No .gitignore found in ${sourceAbsolutePath}`)
    //             return
    //         }

    //         const gitignoreContents = fs.readFileSync(gitignorePath, 'utf8')
    //         const gitignore = ignore().add(gitignoreContents)
    //         gitignore.add('.git')
    //         gitignore.add('.gitignore')

    //         copyDirectoryContents(sourceAbsolutePath, templatePath, {
    //             validate: ({ createName, createPath, isFile, sourcePath }) => {
    //                 const relPath = path.relative(sourceAbsolutePath, sourcePath)
    //                 const ignores = gitignore.ignores(relPath + (isFile ? '' : '/'))

    //                 if (ignores) {
    //                     console.log(`File ${sourcePath} ignored (--with-gitignore)`)
    //                     return false
    //                 }
    //                 return true
    //             }
    //         })
    //     }
    //     else {
    //         copyDirectoryContents(sourceAbsolutePath, templatePath)
    //         console.log(`Saved ${templateName} template at ${templatePath}`)
    //     }
    // }
    // else {
    //     console.log(`Template ${templateName} already exists`)
    // }
}


interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export function paste({ templateName, destinationRelativePath }: PasteOptions) {
    p.log.message(`Pasting template...`)

    const templatePath = `${STRAPUP_DIR_PATH}/templates/${templateName}`
    const destinationAbsolutePath = `${WORK_DIR}/${destinationRelativePath}`

    if (!fs.existsSync(templatePath)) {
        p.log.error(`Template ${templateName} does not exist`)
        return
    }

    if (!fs.existsSync(destinationAbsolutePath)) {
        fs.mkdirSync(destinationAbsolutePath, { recursive: true })
        p.log.info(`Directory ${destinationAbsolutePath} does not exists. Creating it...`)
    }

    copyDirectoryContents(templatePath, destinationAbsolutePath)
    p.log.success(`Pasted ${templateName} template to ${destinationAbsolutePath}`)
}


export function list() {
    console.log('Listing templates...')

    const templates = fs.readdirSync(`${STRAPUP_DIR_PATH}/templates`)

    if (templates.length === 0) {
        console.log('No templates found')
        return
    }

    console.log('Templates:')
    templates.forEach(template => {
        console.log(template)
    })
}

export type ScriptsFunctions = typeof scripts[keyof typeof scripts]
export type ScriptsNames = keyof typeof scripts

interface RunScriptOptions {
    functionToRun: ScriptsFunctions
    functionParams: string[]
}

export async function runScript({ functionParams = [], functionToRun }: RunScriptOptions) {
    // @ts-ignore
    const commands = functionToRun(...functionParams)
    const concatedCommands = commands.join('\n')
    execSync(concatedCommands, { stdio: 'inherit' })
    return
}




// MESS FROM INHERITING OUTPUT from other processes. maybe will come back later
// function diffLines(a: string, b: string) {
//     if (a === b) return;

//     const aLines = a.split('\n');
//     const bLines = b.split('\n');
//     const diff: number[] = [];

//     for (let i = 0; i < Math.max(aLines.length, bLines.length); i++) {
//         if (aLines[i] !== bLines[i]) diff.push(i);
//     }

//     return diff;
// }
    // await new Promise((resolve, reject) => {
    //     const process = exec(concatedCommands)

    //     // process.stdout?.on('data', (data) => {
    //     //     const formattedLines = data
    //     //         .toString()
    //     //         .split('\n')
    //     //         .reduce((acc: string, line: string) => {
    //     //             if (line.trim()) return `${acc}${color.gray(S_BAR)}  ${line.trim()}\n`
    //     //             else return acc
    //     //         }, '')

    //     //     console.log(formattedLines)
    //     // })
    //     process.stdin?.on('close', () => console.log('close'))
    //     process.stdin?.on('drain', () => console.log('drain'))
    //     process.stdin?.on('error', () => console.log('error'))
    //     process.stdin?.on('finish', () => console.log('finish'))
    //     process.stdin?.on('pipe', () => console.log('pipe'))
    //     process.stdin?.on('unpipe', () => console.log('unpipe'))
    //     process.on('message', (data) => console.log('send', data))
    //     process.stdout?.on('data', (data) => console.log('stdout', data))
    //     process.on('close', (code) => resolve(code))
    // })
    // process.stdout.write(erase.screen);
    // process.stdout.write(cursor.move(0, 0));
    // process.stdout.write(cursor.show);
    // const tres = await setTimeout(2000)
    // for (const command of commands) {
    //     p.log.info(`Running: ${color.green(command)}`)
    //     let prevFrame = ''
    //     let prevLinesLen = 0
    //     await new Promise((resolve, reject) => {
    //         const name = command.split(' ')[0]
    //         const args = command.split(' ').slice(1)
    //         const shell = spawn(name, args, { stdio: ['inherit', 'pipe', 'inherit'] })
    //         shell.stdout.on('data', (data) => {
    //             if (!data.toString().trim()) return
    //             let frame = data.toString().trim() as string
    //             // const diff = diffLines(prevFrame, frame)
    //             const linesCount = frame.split('\n').length - 1
    //             // const newLinesCount = frame.split('\n').length - 1
    //             // process.stdout.write(cursor.up(newLinesCount));
    //             // process.stdout.write(erase.down());
    //             // process.stdout.write(cursor.down(newLinesCount));
    //             // process.stdout.write(`${newLinesCount}${frame}`);
    //             process.stdout.moveCursor(0, -prevLinesLen);
    //             // process.stdout.
    //             // process.stdout.cursorTo(0, 0);
    //             process.stdout.clearScreenDown();
    //             process.stdout.write(frame);
    //             prevLinesLen = linesCount
    //             process.stdout.write(color.bgRed('test'));
    //             // process.stdout.write(cursor.left);
    //             // process.stdout.write(cursor.show);
    //             // let linesLen = lines.length
    //             // process.stdout.write(erase.up(prevLinesLen));
    //             // process.stdout.write(cursor.up(prevLinesLen));
    //             // prevLinesLen = linesLen
    //             // lines.forEach((line, i) => {
    //             //     process.stdout.write(line + '\n');
    //             // })
    //             // process.stdout.write(frame);
    //             // process.stdout.write(cursor.show);
    //             // console.log('newLinesCount', newLinesCount)
    //             // if (diff && diff?.length === 1) {
    //             //     const diffLine = diff[0];
    //             //     process.stdout.write(cursor.move(0, diffLine));
    //             //     process.stdout.write(erase.lines(1));
    //             //     const lines = frame.split('\n');
    //             //     process.stdout.write(lines[diffLine]);
    //             //     prevFrame = frame;
    //             //     process.stdout.write(cursor.move(0, lines.length - diffLine - 1));
    //             //     return;
    //             //     // If many lines have changed, rerender everything past the first line
    //             // } else if (diff && diff?.length > 1) {
    //             //     const diffLine = diff[0];
    //             //     process.stdout.write(cursor.move(0, diffLine));
    //             //     process.stdout.write(erase.down());
    //             //     const lines = frame.split('\n');
    //             //     const newLines = lines.slice(diffLine);
    //             //     process.stdout.write(newLines.join('\n'));
    //             //     prevFrame = frame;
    //             //     return;
    //             // }

    //             // process.stdout.write(erase.down());

    //             // process.stdout.write(frame);

    //             // prevFrame = frame;
    //             // console.log('========================')
    //             // console.log('data', data.toString())
    //             // console.log('lines', data.toString().split('\n').length)
    //             // console.log('========================')
    //             // let linesCount = data.toString().split('\n').length
    //             // const trimmedData = data.toString().trim()
    //             // const linesCount = trimmedData.split('\n').length
    //             // console.log('linesCount', linesCount)
    //             // const formattedLines = data
    //             //     .toString()
    //             //     .split('\n')
    //             //     .reduce((acc: string, line: string) => {
    //             //         if (line.trim()) {
    //             //             return `${acc}${color.gray(S_BAR)}  ${line.trim()}\n`
    //             //         }
    //             //         else return acc
    //             //     }, '')
    //             // console.log(formattedLines)
    //             // process.stdout.write(erase.lines(linesCount))
    //             // console.log(data.toString())
    //             // process.stdout.write(data.toString())
    //         })
    //         shell.on('close', (code) => resolve(code))
    //     })
    // }
