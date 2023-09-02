#!/usr/bin/env node
import * as fs from 'fs';
import * as afs from 'node:fs/promises';
const TEMPLATO_DIR_NAME = 'templato';
const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`;
const WORK_DIR = process.cwd();
async function main() {
    const args = process.argv;
    if (!fs.existsSync(TEMPLATO_DIR_PATH)) {
        await afs.mkdir(`${TEMPLATO_DIR_PATH}/templates`, { recursive: true });
        console.log(`Created ${TEMPLATO_DIR_NAME} directory at ${TEMPLATO_DIR_PATH}`);
    }
    const command = args[2];
    switch (command) {
        case 'create': {
            console.log('Creating template...');
            const templateName = args[3];
            const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`;
            const sourceRelativePath = args[4] || '.';
            const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`;
            if (!fs.existsSync(sourceAbsolutePath)) {
                console.log(`Directory specified as source: ${sourceAbsolutePath} does not exist`);
                return;
            }
            if (!fs.existsSync(templatePath)) {
                await afs.mkdir(templatePath, { recursive: true });
                createDirectoryContents(templatePath, sourceAbsolutePath);
                console.log(`Created ${templateName} template at ${templatePath}`);
            }
            else {
                console.log(`Template ${templateName} already exists`);
            }
            break;
        }
        case 'spawn': {
            console.log('Spawning template...');
            const templateName = args[3];
            const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`;
            const destinationRelativePath = args[4] || '.';
            const destinationAbsolutePath = `${WORK_DIR}/${destinationRelativePath}`;
            if (!fs.existsSync(templatePath)) {
                console.log(`Template ${templateName} does not exist`);
                return;
            }
            if (!fs.existsSync(destinationAbsolutePath)) {
                console.log(`Directory specified as destination: ${destinationAbsolutePath} does not exists`);
                return;
            }
            createDirectoryContents(destinationAbsolutePath, templatePath);
            console.log(`Created ${destinationRelativePath} directory at ${destinationAbsolutePath}`);
            break;
        }
        default: {
            console.log('Command not found');
            break;
        }
    }
}
const createDirectoryContents = (toCopyToPath, toCopyFromPath) => {
    const filesToCreate = fs.readdirSync(toCopyFromPath);
    filesToCreate.forEach(file => {
        const origFilePath = `${toCopyFromPath}/${file}`;
        const stats = fs.statSync(origFilePath);
        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            const writePath = `${toCopyToPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            fs.mkdirSync(`${toCopyToPath}/${file}`);
            createDirectoryContents(`${toCopyFromPath}/${file}`, `${toCopyToPath}/${file}`);
        }
    });
};
main();
