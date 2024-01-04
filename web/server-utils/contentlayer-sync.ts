import { DbScript, DbTemplte } from "@/db/types";
import { getScriptMdx, getTemplateMdx } from "./automatic-mdx";
import * as fs from "fs";
import pg from 'pg'
const { Client } = pg


async function getNotSyncedScripts() {
    const dbClient = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
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
    const dbClient = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
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
    const res = await fetch(`http://localhost:5000/api/scripts?name=${scriptName}`, {
        headers: {
            'Authorization': process.env.API_ROOT_KEY as string
        }
    })
    if (!res.ok) {
        console.error(`Failed to download script ${scriptName}`)
        return
    }
    const script = await res.text()
    fs.writeFileSync(savePath, script)
}

async function downloadTemplate(templateName: string, savePath: string) {
    const res = await fetch(`http://localhost:5000/api/templates?name=${templateName}`, {
        headers: {
            'Authorization': process.env.API_ROOT_KEY as string
        }
    })
    if (!res.ok) {
        console.error(`Failed to download template ${templateName}`)
        return
    }
    const template = await res.text()
    fs.writeFileSync(savePath, template)
}

export async function syncContent(contentDir: string) {
    // await syncContentWorker(contentDir)

    let wasCancelled = false
    const interval = setInterval(async () => {
        if (wasCancelled) return
        await syncContentWorker(contentDir)
    }, 1000 * 60 * 60)

    return () => {
        wasCancelled = true
        clearInterval(interval)
    }
}

export function escape(fileName: string) {
    return fileName.replace(/\//g, '_-_')
}

export function unEscape(fileName: string) {
    return fileName.replace(/_-_/g, '/')
}

async function syncContentWorker(contentDir: string) {
    const notSyncedScripts = await getNotSyncedScripts()
    console.log("notSyncedScripts", notSyncedScripts)
    const notSyncedTemplates = await getNotSyncedTemplates()
    console.log("notSyncedTemplates", notSyncedTemplates)

    notSyncedScripts.forEach(async (scriptName) => {
        fs.rmSync(process.env.PWD + '/temp', { force: true, recursive: true })
        fs.mkdirSync(process.env.PWD + '/temp')
        const savePath = process.env.PWD + `/temp/script.mjs`
        await downloadScript(scriptName, savePath)
        const scriptMdx = await getScriptMdx(savePath)
        fs.writeFileSync(`${contentDir}/remote-scripts/${escape(scriptName)}.mdx`, scriptMdx)
        // fs.rmSync('/temp', { force: true, recursive: true })
    })

    notSyncedTemplates.forEach(async (templateName) => {
        fs.rmSync(process.env.PWD + '/temp', { force: true, recursive: true })
        fs.mkdirSync(process.env.PWD + '/temp')
        const savePath = `temp/${escape(templateName)}.mjs`
        await downloadTemplate(templateName, savePath)
        const templateMdx = await getTemplateMdx(savePath, templateName)
        fs.writeFileSync(`${contentDir}/remote-templates/${escape(templateName)}.mdx`, templateMdx)
        // fs.rmSync('/temp', { force: true, recursive: true })
    })
}
