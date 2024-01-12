/**
 * @typedef {Object} Script
 * @property {string} description - Description, which will be seen in the teminal and in the docs.
 * @property {string[]} tags - Tags are used to search for script.
 * @property {function(...string): string[]} command - Executed commands.
 */

/** @type {Script} */
export default {
    description: "Something intersting about the script...",
    tags: ["python", "flask", "sqlalchemy"],
    command: () => [
        `echo "Change contents of this commands array"`,
    ],
}
