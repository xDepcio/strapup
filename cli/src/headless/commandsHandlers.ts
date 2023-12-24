// import * as p from '@clack/prompts'
import * as p from '../clack-lib/prompts/index.js'
import * as fs from 'fs'
import path from 'path'
import color from 'picocolors'
import { ScriptsFunction, TEMPLATES_PATH } from './constants.js'
import { WORK_DIR } from "./index.js"
import { copyDirectoryContents, sendTelemetryStats } from "./utils.js"
import { execSync } from 'child_process'
// import { S_BAR } from '../clack/styled/utils.js'

interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export async function paste({ templateName, destinationRelativePath }: PasteOptions) {
    const templatePath = path.normalize(`${TEMPLATES_PATH()}/${templateName}`)
    const destinationAbsolutePath = path.normalize(`${WORK_DIR}/${destinationRelativePath}`)

    if (!fs.existsSync(templatePath)) {
        p.log.error(`Template ${templateName} does not exist. Aborting.`)
        return
    }

    if (!fs.existsSync(destinationAbsolutePath)) {
        fs.mkdirSync(destinationAbsolutePath, { recursive: true })
        p.log.info(`Directory ${color.dim(destinationAbsolutePath)} does not exists. Creating it...`)
    }

    await copyDirectoryContents({ fromPath: templatePath, toPath: destinationAbsolutePath })
    p.log.success(`Pasted ${templateName} template to ${color.dim(destinationAbsolutePath)}`)
    sendTelemetryStats("templatePasted")
}

interface RunScriptOptions {
    functionToRun: ScriptsFunction
    functionParams: string[]
}

export async function runScript({ functionParams = [], functionToRun }: RunScriptOptions) {
    const commands = functionToRun(...functionParams)
    const concatedCommands = commands.join('\n')

    p.log.info(`Running following commands, follow on-screen prompts.`)
    commands.forEach(command => {
        console.log(`${color.gray(p.S_BAR)}  ${color.green(command)}`)
    })

    execSync(concatedCommands, { stdio: 'inherit' })

    p.log.success(`Script ${functionToRun.name} finished successfully.`)
    sendTelemetryStats("scriptRan")
}
