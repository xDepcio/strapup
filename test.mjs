/**
 * @typedef {Object} Script
 * @property {string} description - Description, which will be seen in the teminal and in the docs.
 * @property {string[]} tags - Tags are used to search for script.
 * @property {function(...string): string[]} command - Executed commands.
 */

/** @type {Script} */
export default {
    description: `Something intersting about the script...`,
    tags: ["python", "flask", "sqlalchemy"],
    command: (projectName) => [
        `npx create-next-app@14.0.4 ${projectName} --ts --tailwind --app --no-eslint --no-src-dir --import-alias "@/*"`,
        `npx strapup run-script @xDepcio/Add-ShadcnUi`
    ],
}
