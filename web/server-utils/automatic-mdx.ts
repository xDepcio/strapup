#!/usr/bin/env node

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const TEMPLATES_PATH = `${process.env.STRAPUP_DIR_PATH}/templates`
const SCRIPTS_PATH = `${process.env.STRAPUP_DIR_PATH}/scripts.mjs`
const TEMPLATES_SORT_OFFSET = 100
const SCRIPTS_SORT_OFFSET = 1000
// @ts-ignore
export const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("TEMPLATES_PATH", TEMPLATES_PATH)
console.log("TEMPLATES_PATH", TEMPLATES_PATH)
console.log("TEMPLATES_PATH", TEMPLATES_PATH)
console.log("SCRIPTS_PATH", SCRIPTS_PATH)
console.log("SCRIPTS_PATH", SCRIPTS_PATH)
console.log("SCRIPTS_PATH", SCRIPTS_PATH)
console.log("__dirname", __dirname)
console.log("__dirname", __dirname)
console.log("__dirname", __dirname)

export async function getScriptMdx(scriptPath: string) {
    type Script = {
        description: string
        command: (...args: string[]) => string[]
    }

    const scripts: Script = await import(scriptPath).then(module => module.default)
    const params = getParameterNames(scripts.command)
    const args = params.map((param) => `\${${param}}`)
    const script = {
        name: path.basename(scriptPath, ".mjs"),
        description: scripts.description,
        command: scripts.command(...args),
    }
    const mdxContent = getMdxScriptsContent({ sortNum: 1, script })
    return mdxContent
}

const createScriptsMdx = async () => {
    type Scripts = {
        [key: string]: {
            description: string
            command: (...args: string[]) => string[]
        }
    }
    const scripts: Scripts = await import(SCRIPTS_PATH).then(module => module.scripts)
    const sciriptsFormatted = Object.entries(scripts).map(([scriptName, { description, command }], i) => {
        const params = getParameterNames(command)
        const args = params.map((param) => `\${${param}}`)
        return {
            name: scriptName,
            description,
            command: command(...args),
        }
    })
    sciriptsFormatted.forEach((script, i) => {
        const mdxContent = getMdxScriptsContent({ sortNum: SCRIPTS_SORT_OFFSET + i, script })
        fs.writeFileSync(`${__dirname}/../results/scripts/${script.name}.mdx`, mdxContent)
    })
}

const getMdxScriptsContent = ({ script, sortNum }: { sortNum: number, script: { name: string, description?: string, command: string[] } }) => {
    return `---
title: ${script.name}
sortNum: ${sortNum}
---
### ${script.name}
${script.description || ''}
### Executed commands
\`\`\`bash
${script.command.join("\n")}
\`\`\`
`
}

export const createTemplatesMdx = async () => {

    const templates = fs.readdirSync(TEMPLATES_PATH)

    templates.forEach(async (template, i) => {
        const dirStructure = await getTreeString(`${TEMPLATES_PATH}/${template}`)
        let description = ''
        if (fs.existsSync(`${TEMPLATES_PATH}/${template}/_strapupmetadata.json`)) {
            const templateInfo = JSON.parse(fs.readFileSync(`${TEMPLATES_PATH}/${template}/_strapupmetadata.json`, "utf-8"))
            if (templateInfo.templateDesc) description = templateInfo.templateDesc
        }
        const filesNames = getAllFilesNameDepthFirst(`${TEMPLATES_PATH}/${template}`)
        const codeBlocks = getCodeBlocks(filesNames, template)
        const mdxContent = getMdxContent({ sortNum: TEMPLATES_SORT_OFFSET + i, title: template, codeBlocks, treeString: dirStructure, description })
        fs.writeFileSync(`${__dirname}/../results/templates/${template}.mdx`, mdxContent)
    })

}

const getCodeBlocks = (files: string[], templateName: string) => files.map((file) => {
    const fileContent = fs.readFileSync(file, "utf-8")
    const fileExtension = path.extname(file).replace(".", "")
    return `\`\`\`${fileExtension} title="${file.replace(`${TEMPLATES_PATH}/${templateName}`, '.')}"
${fileContent}\`\`\``
}).join("\n")

const getMdxContent = ({ sortNum, title, codeBlocks, description, treeString }: { title: string, sortNum: number, treeString?: string, description?: string, codeBlocks?: string }) => {
    return `---
title: ${title}
sortNum: ${sortNum}
---
### ${title}
${description || ""}
${treeString ? `#### Pasted files structure
\`\`\`bash
${treeString}\`\`\`` : ''}
#### Files contents
${codeBlocks || ''}
`
}

function getTreeString(dirPath: string) {
    const ignoredFilesNames = new RegExp(`.*_strapupmetadata.json.*\n|.*directories.*files.*|\n\n|.*${dirPath}.*\n|0 directories, 1 file`, "g")

    return new Promise<string>((resolve, reject) => {
        const shell = spawn("tree", [dirPath])
        let treeString = ""
        shell.stdout.on("data", (data) => {
            treeString += data.toString()
        })
        shell.on("close", () => {
            resolve(treeString.replace(ignoredFilesNames, ""))
        })
    })
}

function getAllFilesNameDepthFirst(dirPath: string) {
    const ignoreNames = ['_strapupmetadata.json']
    const files = fs.readdirSync(dirPath)
    let filesNameDepthFirst: string[] = []
    for (const file of files) {
        if (ignoreNames.includes(file)) continue
        const filePath = path.join(dirPath, file)
        const isDirectory = fs.statSync(filePath).isDirectory()
        if (isDirectory) {
            filesNameDepthFirst = [...filesNameDepthFirst, ...getAllFilesNameDepthFirst(filePath)]
        } else {
            filesNameDepthFirst.push(filePath)
        }
    }
    return filesNameDepthFirst
}

export function getParameterNames(func: Function) {
    const funcString = func.toString();
    const parameterNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .split(',')
        .map((param) => param.trim());
    return parameterNames.filter(Boolean); // Removes empty strings
}

// createTemplatesMdx()
// createScriptsMdx()
