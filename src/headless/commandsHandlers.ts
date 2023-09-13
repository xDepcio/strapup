import * as p from '@clack/prompts'
import * as fs from 'fs'
import path from 'path'
import color from 'picocolors'
import { TEMPLATES_PATH } from './constants.js'
import { WORK_DIR } from "./index.js"
import { copyDirectoryContents, sendTelemetryStats } from "./utils.js"

interface PasteOptions {
    templateName: string,
    destinationRelativePath: string
}

export function paste({ templateName, destinationRelativePath }: PasteOptions) {
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

    copyDirectoryContents({ fromPath: templatePath, toPath: destinationAbsolutePath })
    p.log.success(`Pasted ${templateName} template to ${color.dim(destinationAbsolutePath)}`)
    sendTelemetryStats("templatePasted")
}
