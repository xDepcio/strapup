#!/usr/bin/env node
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const TEMPLATES_PATH = "../public/templates";
const SORT_OFFSET = 100;
// @ts-ignore
export const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
export const createMdxMain = async () => {
    const templates = fs.readdirSync(TEMPLATES_PATH);
    // for (const template of templates) {
    templates.forEach(async (template, i) => {
        const dirStructure = await getTreeString(`${TEMPLATES_PATH}/${template}`);
        let description = '';
        if (fs.existsSync(`${TEMPLATES_PATH}/${template}/_strapupmetadata.json`)) {
            const templateInfo = JSON.parse(fs.readFileSync(`${TEMPLATES_PATH}/${template}/_strapupmetadata.json`, "utf-8"));
            if (templateInfo.templateDesc)
                description = templateInfo.templateDesc;
        }
        const filesNames = getAllFilesNameDepthFirst(`${TEMPLATES_PATH}/${template}`);
        const codeBlocks = getCodeBlocks(filesNames, template);
        const mdxContent = getMdxContent({ sortNum: SORT_OFFSET + i, title: template, codeBlocks, treeString: dirStructure, description });
        fs.writeFileSync(`./results/${template}.mdx`, mdxContent);
    });
};
const getCodeBlocks = (files, templateName) => files.map((file) => {
    const fileContent = fs.readFileSync(file, "utf-8");
    const fileExtension = path.extname(file).replace(".", "");
    return `\`\`\`${fileExtension} title="${file.replace(`${TEMPLATES_PATH}/${templateName}`, '.')}"
${fileContent}\`\`\``;
}).join("\n");
const getMdxContent = ({ sortNum, title, codeBlocks, description, treeString }) => {
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
`;
};
function getTreeString(dirPath) {
    const ignoredFilesNames = new RegExp(`.*_strapupmetadata.json.*\n|.*directories.*files.*|\n\n|.*${dirPath}.*\n`, "g");
    return new Promise((resolve, reject) => {
        const shell = spawn("tree", [dirPath]);
        let treeString = "";
        shell.stdout.on("data", (data) => {
            treeString += data.toString();
        });
        shell.on("close", () => {
            resolve(treeString.replace(ignoredFilesNames, ""));
        });
    });
}
function getAllFilesNameDepthFirst(dirPath) {
    const ignoreNames = ['_strapupmetadata.json'];
    const files = fs.readdirSync(dirPath);
    let filesNameDepthFirst = [];
    for (const file of files) {
        if (ignoreNames.includes(file))
            continue;
        const filePath = path.join(dirPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        if (isDirectory) {
            filesNameDepthFirst = [...filesNameDepthFirst, ...getAllFilesNameDepthFirst(filePath)];
        }
        else {
            filesNameDepthFirst.push(filePath);
        }
    }
    return filesNameDepthFirst;
}
// createMdxMain()
