import pg from 'pg'
const { Client } = pg
import { type QueryResult, type QueryResultRow } from "pg";
import * as fs from "fs";
import { DbScript, DbTemplte } from '@/db/types';

export async function DBQuery<T extends QueryResultRow>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    const dbClient = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })

    await dbClient.connect()
    const res = await dbClient.query<T>(query, params)
    dbClient.end()
    return res
}

export function escape(fileName: string) {
    return fileName.replace(/\//g, '_-_')
}

export function unEscape(fileName: string) {
    return fileName.replace(/_-_/g, '/')
}

export async function getNotSyncedScripts() {
    const { rows, rowCount } = await DBQuery<Pick<DbScript, 'name'>>(`
        SELECT name FROM scripts
        WHERE synced IS FALSE
    `)
    if (rowCount === 0) return []

    return rows.map(({ name }) => name)
}

export async function getNotSyncedTemplates() {
    const { rows, rowCount } = await DBQuery<Pick<DbTemplte, 'name'>>(`
        SELECT name FROM templates
        WHERE synced IS FALSE
    `)
    if (rowCount === 0) return []

    return rows.map(({ name }) => name)
}

export async function downloadScript(scriptName: string, savePath: string) {
    const res = await fetch(`http://localhost:5000/api/scripts?name=${scriptName}`, {
        headers: {
            'Authorization': process.env.API_ROOT_KEY as string
        }
    })
    if (!res.ok) {
        console.error(`Failed to download script ${scriptName}`)
        throw new Error(`Failed to download script ${scriptName}`)
    }
    const script = await res.text()
    console.log("script text", script)
    fs.writeFileSync(savePath, script)
}

export async function downloadTemplate(templateName: string, savePath: string) {
    const templateStructure = await getTemplateStrcuture(templateName)
    if (!templateStructure) return

    console.log("templateStructure", templateStructure)
    console.log("savePath", savePath)
    console.log("templateName", templateName)
    await saveTemplateStructure(templateStructure, savePath, templateName)
}

async function saveTemplateStructure(templateStructure: TemplateStructureResponse, savePath: string, currPathFromTemplate: string) {
    if (templateStructure.isDir) {
        fs.mkdirSync(savePath)
        for (const child of templateStructure.children) {
            await saveTemplateStructure(child, `${savePath}/${child.name}`, `${currPathFromTemplate}/${child.name}`)
        }
    } else {
        const fileContent = await fetchFileContent(currPathFromTemplate)
        fs.writeFileSync(savePath, fileContent)
    }
}

async function fetchFileContent(fileFullPath: string) {
    const res = await fetch(`http://localhost:5000/api/templates/file?name=${fileFullPath}`, {
        headers: {
            'Authorization': process.env.API_ROOT_KEY as string
        }
    })
    if (!res.ok) {
        console.error(`Failed to download file ${fileFullPath}`)
        return
    }
    return await res.text()
}

type TemplateStructureResponse = {
    name: string
    isDir: boolean
    children: TemplateStructureResponse[]
}
async function getTemplateStrcuture(templateName: string) {
    const res = await fetch(`http://localhost:5000/api/templates/structure?name=${templateName}`, {
        headers: {
            'Authorization': process.env.API_ROOT_KEY as string
        }
    })
    if (!res.ok) {
        console.error(`Failed to download template ${templateName}`)
        return
    }
    const template = await res.json()
    return template as TemplateStructureResponse
}

export async function markScriptAsSynced(scriptName: string) {
    await DBQuery(`
        UPDATE scripts SET synced = TRUE
        WHERE name = $1
    `, [scriptName])
}

export async function markTemplateAsSynced(templateName: string) {
    await DBQuery(`
        UPDATE templates SET synced = TRUE
        WHERE name = $1
    `, [templateName])
}
