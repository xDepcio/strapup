/**
 * @typedef {Object} Script
 * @property {string} description - Description, which will be seen in the teminal and in the docs.
 * @property {string[]} tags - Tags are used to search for script.
 * @property {function(...string): string[]} command - Executed commands.
 */

/** @type {Script} */
export default {
    description: `Add latest shadcn/ui with following components.
    - Button`,
    tags: ["next", "shadcn", "ui", 'react'],
    command: () => [
        `npx shadcn-ui@latest init`,
        `npx shadcn-ui@latest add button`,
    ],
}
