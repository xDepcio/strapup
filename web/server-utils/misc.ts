import { dbClient } from "@/db/db";
import { DbScript, DbTemplte } from "@/db/types";
import { getScriptMdx } from "./automatic-mdx";
import * as fs from "fs";

async function getNotSyncedScripts() {
    await dbClient.connect()

    const { rows, rowCount } = await dbClient.query<Pick<DbScript, 'name'>>(`
        SELECT name FROM scripts
        WHERE synced IS FALSE
    `)
    if (rowCount === 0) return []

    dbClient.end()
    return rows.map(({ name }) => name)
}

async function getNotSyncedTemplates() {
    await dbClient.connect()

    const { rows, rowCount } = await dbClient.query<Pick<DbTemplte, 'name'>>(`
        SELECT name FROM templates
        WHERE synced IS FALSE
    `)
    if (rowCount === 0) return []

    dbClient.end()
    return rows.map(({ name }) => name)
}

async function downloadScript(scriptName: string, savePath: string) {
}

export async function syncContent(contentDir: string) {
    await syncContentWorker(contentDir)

    let wasCancelled = false
    const interval = setInterval(async () => {
        if (wasCancelled) return
        await syncContentWorker(contentDir)
    }, 1000 * 60)

    return () => {
        wasCancelled = true
        clearInterval(interval)
    }
}

async function syncContentWorker(contentDir: string) {
    const notSyncedScripts = await getNotSyncedScripts()
    // const notSyncedTemplates = await getNotSyncedTemplates()

    notSyncedScripts.forEach(async (scriptName) => {
        const savePath = `temp/script.mjs`
        await downloadScript(scriptName, savePath)
        const scriptMdx = await getScriptMdx(savePath)
        fs.writeFileSync(`${contentDir}/remote-scripts/${scriptName}.mdx`, scriptMdx)
        fs.rmSync('/temp', { force: true, recursive: true })
    })

    // notSyncedTemplates.forEach(async (templateName) => {
    //     const savePath = `temp/template.mjs`
    //     await downloadScript(templateName, savePath)
    //     const templateMdx = await getScriptMdx(savePath)
    //     fs.writeFileSync(`${contentDir}/remote-templates/${templateName}.mdx`, templateMdx)
    //     fs.rmSync('/temp', { force: true, recursive: true })
    // })
}
