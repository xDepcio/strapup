import color from 'picocolors'
import { loadSettings } from './utils.js'

export const STRAPUP_DIR_NAME = 'strapup'
export const TEMPLATES_PATH = () => loadSettings().strapupDirPath + `/templates`
export const SCRIPTS_PATH = () => loadSettings().strapupDirPath + `/scripts.js`

export const scriptsContent = `export const scripts = {
    nextshad: (projectName) => [
        \`npx create-next-app \${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"\`,
        \`cd \${projectName}\`,
        \`npx shadcn-ui@latest init -y\`,
        \`strapup paste redux-ts redux\`
    ],
    shadcn: () => [
        \`npx shadcn-ui@latest init -y\`,
    ]
}
`

export const dirNotSpecifiedStartupWarning = `Path to save strapup files is not specified. This may happen when:
${color.yellow("-")} ${color.dim("This is your first time running strapup.")}
${color.yellow("-")} ${color.dim("You haven't installed strapup globally (npx i strapup -g).")}
${color.yellow("-")} ${color.dim("Strapup has updated and erased its settings file. (Your templates are safe, you need to specify path to them again.)")}
${color.yellow("-")} ${color.dim("You have deleted strapup directory.")}`

export type StrapupSettings = {
    strapupDirPath: string | null
}

export const inintialSettings: StrapupSettings = {
    strapupDirPath: null
}

export type ScriptsFunction = (...args: string[]) => string[]

export type Scripts = {
    [key: string]: ScriptsFunction
}
