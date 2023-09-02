#!/usr/bin/env node
import * as fs from 'fs';
import * as afs from 'node:fs/promises';
const TEMPLATO_DIR_NAME = 'templato';
const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`;
const CURR_DIR = process.cwd();
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
            if (!fs.existsSync(templatePath)) {
                await afs.mkdir(templatePath, { recursive: true });
                console.log(`Created ${templateName} template at ${templatePath}`);
            }
            else {
                console.log(`Template ${templateName} already exists`);
            }
            break;
        }
        default: {
            console.log('Command not found');
            break;
        }
    }
}
main();
