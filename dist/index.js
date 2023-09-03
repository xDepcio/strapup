#!/usr/bin/env node
import * as fs from 'fs';
import * as afs from 'node:fs/promises';
import ignore from 'ignore';
import path from 'path';
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
        case 'save': {
            console.log('Saving template...');
            const templateName = args[3];
            const templatePath = `${TEMPLATO_DIR_PATH}/templates/${templateName}`;
            const sourceRelativePath = args[4] || '.';
            const sourceAbsolutePath = `${WORK_DIR}/${sourceRelativePath}`;
            const flagArgs = args.slice(5);
            const withGitignore = flagArgs.includes('--with-gitignore');
            if (!fs.existsSync(sourceAbsolutePath)) {
                console.log(`Directory specified as source: ${sourceAbsolutePath} does not exist`);
                return;
            }
            if (!fs.existsSync(templatePath)) {
                await afs.mkdir(templatePath, { recursive: true });
                if (withGitignore) {
                    const gitignorePath = `${sourceAbsolutePath}/.gitignore`;
                    if (!fs.existsSync(gitignorePath)) {
                        console.log(`No .gitignore found in ${sourceAbsolutePath}`);
                        return;
                    }
                    const gitignoreContents = fs.readFileSync(gitignorePath, 'utf8');
                    console.log(`gitignoreContents ${gitignoreContents}`);
                    const gitignore = ignore().add(gitignoreContents);
                    gitignore.add('.git');
                    gitignore.add('.gitignore');
                    // console.log(`sourceAbsolutePath ${sourceAbsolutePath}`)
                    // const relPath = path.relative(sourceAbsolutePath, `${sourceAbsolutePath}/redux`)
                    // console.log(`relPath ${relPath}`)
                    // break
                    createDirectoryContents(templatePath, sourceAbsolutePath, {
                        validate: ({ createName, createPath, isFile, sourcePath }) => {
                            // console.log(`sap ${sourceAbsolutePath} sp ${sourcePath}`)
                            const relPath = path.relative(sourceAbsolutePath, sourcePath);
                            // console.log(`relPath ${relPath}`)
                            const ignores = gitignore.ignores(relPath + (isFile ? '' : '/'));
                            // console.log(`ignores ${ignores}`)
                            if (ignores) {
                                // console.log(`sap ${sourceAbsolutePath} sp ${sourcePath}`)
                                console.log(`File ${sourcePath} ignored (--with-gitignore))`);
                                return false;
                            }
                            return true;
                        }
                    });
                    break;
                }
                createDirectoryContents(templatePath, sourceAbsolutePath);
                console.log(`Saved ${templateName} template at ${templatePath}`);
            }
            else {
                console.log(`Template ${templateName} already exists`);
            }
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
            createDirectoryContents(destinationAbsolutePath, templatePath);
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
const createDirectoryContents = (toCopyToPath, toCopyFromPath, options = { validate: () => true }) => {
    const filesToCreate = fs.readdirSync(toCopyFromPath);
    filesToCreate.forEach(file => {
        const origFilePath = `${toCopyFromPath}/${file}`;
        const stats = fs.statSync(origFilePath);
        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            const writePath = `${toCopyToPath}/${file}`;
            if (!options.validate({ createName: file, createPath: writePath, isFile: true, sourcePath: origFilePath })) {
                return;
            }
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            if (!options.validate({ createName: file, createPath: `${toCopyToPath}/${file}`, isFile: false, sourcePath: origFilePath })) {
                return;
            }
            fs.mkdirSync(`${toCopyToPath}/${file}`);
            createDirectoryContents(`${toCopyFromPath}/${file}`, `${toCopyToPath}/${file}`);
        }
    });
};
main();
