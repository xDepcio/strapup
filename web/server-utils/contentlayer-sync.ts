import * as fs from "fs";
import { getScriptMdx, getTemplateMdx } from "./automatic-mdx";
import { downloadScript, downloadTemplate, escape, getNotSyncedScripts, getNotSyncedTemplates, markScriptAsSynced, markTemplateAsSynced } from "./helpers";


async function syncContentWorker(contentDir: string) {
    const notSyncedScripts = await getNotSyncedScripts()
    console.log("notSyncedScripts", notSyncedScripts)
    const notSyncedTemplates = await getNotSyncedTemplates()
    console.log("notSyncedTemplates", notSyncedTemplates)

    notSyncedScripts.forEach(async (scriptName) => {
        try {
            fs.rmSync(process.env.PWD + '/temp', { force: true, recursive: true })
            fs.mkdirSync(process.env.PWD + '/temp')
            const savePath = process.env.PWD + `/temp/${escape(scriptName)}.mjs`
            await downloadScript(scriptName, savePath)
            const scriptMdx = await getScriptMdx(savePath)
            fs.writeFileSync(`${contentDir}/remote-scripts/${escape(scriptName)}.mdx`, scriptMdx)
            // await markScriptAsSynced(scriptName)
        } catch (e) {
            console.error("Failed to sync script", scriptName)
            console.error(e)
        }
    })

    // notSyncedTemplates.forEach(async (templateName) => {
    //     try {
    //         fs.rmSync(process.env.PWD + '/temp', { force: true, recursive: true })
    //         fs.mkdirSync(process.env.PWD + '/temp')
    //         const savePath = `temp/${escape(templateName)}`
    //         await downloadTemplate(templateName, savePath)
    //         const templateMdx = await getTemplateMdx(savePath, templateName)
    //         fs.writeFileSync(`${contentDir}/remote-templates/${escape(templateName)}.mdx`, templateMdx)
    //         // await markTemplateAsSynced(templateName)
    //     } catch (e) {
    //         console.error("Failed to sync template", templateName)
    //         console.error(e)
    //     }
    // })
}

export async function syncContent(contentDir: string) {
    await syncContentWorker(contentDir)

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
