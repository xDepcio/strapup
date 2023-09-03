#!/usr/bin/env node
import * as fs from 'fs';
import * as afs from 'node:fs/promises';
import { save } from './commandsHandlers.js';
import { copyDirectoryContents } from './utils.js';
export const TEMPLATO_DIR_NAME = 'templato';
export const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`;
export const WORK_DIR = process.cwd();
export const args = process.argv;
async function main() {
    if (!fs.existsSync(TEMPLATO_DIR_PATH)) {
        await afs.mkdir(`${TEMPLATO_DIR_PATH}/templates`, { recursive: true });
        console.log(`Created ${TEMPLATO_DIR_NAME} directory at ${TEMPLATO_DIR_PATH}`);
    }
    const command = args[2];
    switch (command) {
        case 'save': {
            const templateName = args[3];
            const sourceRelativePath = args[4] || '.';
            const flagArgs = args.slice(5);
            const withGitignore = flagArgs.includes('--with-gitignore');
            await save({ sourceRelativePath, templateName, withGitignore });
            break;
        }
        case 'paste': {
            console.log('Pasting template...');
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
            copyDirectoryContents(templatePath, destinationAbsolutePath);
            console.log(`Pasted ${templateName} template to ${destinationAbsolutePath}`);
            break;
        }
        case 'list': {
            console.log('Listing templates...');
            const templates = fs.readdirSync(`${TEMPLATO_DIR_PATH}/templates`);
            if (templates.length === 0) {
                console.log('No templates found');
                return;
            }
            console.log('Templates:');
            templates.forEach(template => {
                console.log(template);
            });
            break;
        }
        default: {
            console.log('Command not found');
            break;
        }
    }
}
main();
