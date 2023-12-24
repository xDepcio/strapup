import color from 'picocolors'
import { loadSettings } from './utils.js'
import { dirname, normalize } from 'path'
import { __dirname } from './index.js'
import { fileURLToPath } from 'url'

export const STRAPUP_DIR_NAME = '.strapup'
export const STRAPUP_DIR_PATH = normalize((process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME) + '/' + STRAPUP_DIR_NAME)
export const SETTINGS_PATH = normalize(STRAPUP_DIR_PATH + '/.settings.json')
export const TEMPLATES_PATH = () => normalize(STRAPUP_DIR_PATH + `/templates`)
export const SCRIPTS_DIR_PATH = normalize(STRAPUP_DIR_PATH + `/scripts`)
export const MAIN_SCRIPT_PATH = normalize(SCRIPTS_DIR_PATH + `/scripts.mjs`)
export const USER_SCRIPTS_PATH = normalize(SCRIPTS_DIR_PATH + `/user-scripts.mjs`)
// export const SCRIPTS_PATH = () => normalize(STRAPUP_DIR_PATH + `/scripts.mjs`)
export const premadeTemplatesDirPath = () => normalize(`${ROOT_PATH}/premade-templates`)
export const STRAPUP_DIR_PATH_ENV_NAME = 'STRAPUP_DIR_PATH'
export const statsUrl = "https://strapup-web.vercel.app"
export const ROOT_PATH = normalize(dirname(fileURLToPath(import.meta.url)) + '/..')

export const scriptsContent = `export const scripts = {
    "Create-Next-ShadcnUI-TS": {
        description: "New Next.js app, Shadcn UI add (button, input, skeleton, dropdown), darkmode",
        command: (projectName) => [
            \`npx create-next-app \${projectName}\`,
            \`cd \${projectName}\`,
            \`npx strapup run-script Add-ShadcnUI-TS\`,
        ],
    },
    "Create-Next-Kirimase-Contenlayer": {
        description: "New Next.js app made with kirimase, and contentlayer docs template",
        command: (projectName) => [
            \`npx create-next-app \${projectName}\`,
            \`cd \${projectName}\`,
            \`npx kirimase init\`,
            \`npx strapup run-script Add-Contentlayer-docs-nav-template-TS\`,
        ],
    },
    "Add-Next-RTK-TS": {
        description: "Add TS RTK to existing NextJS app",
        command: (pasteDir) => [
            \`npm i @reduxjs/toolkit react-redux\`,
            \`npx strapup paste next-redux-ts \${pasteDir}\`,
        ],
    },
    "Add-ShadcnUI-TS": {
        description: "To existing next app, Shadcn UI add (button, input, skeleton, dropdown), darkmode",
        command: () => [
            \`npx shadcn-ui@latest init -y\`,
            \`npx shadcn-ui@latest add button -y\`,
            \`npx shadcn-ui@latest add input -y\`,
            \`npx shadcn-ui@latest add skeleton -y\`,
            \`npx shadcn-ui@latest add dropdown-menu -y\`,
            \`npm i next-themes\`,
            \`npx strapup paste next-shad-darkmode ./\`,
        ],
    },
    "Add-Next-Auth.js-TS": {
        description: "To existing next app, add basic next-auth",
        command: () => [
            \`npm i next-auth\`,
            \`npx strapup paste next13-app-auth-paste-from-root ./\`,
        ],
    },
    "Add-Contentlayer-docs-nav-template-TS": {
        description: "Add working contentlayer MDX template to existing NextJS project",
        command: () => [
            \`npm i contentlayer next-contentlayer react-icons react-hot-toast remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code\`,
            \`npx strapup paste contentlayer-config ./\`,
            \`npx strapup paste contentlayer-next-styled-mdx-components ./\`,
            \`npx strapup paste contentlayer-next-docs-page-with-nav ./\`,
        ]
    }
    // Create a new script by adding a key-value pair based on examples above.
}`

export const userScriptsContent = `export const scripts = {
    // "@userName/scriptsName": {
    //     description: "This will be show as scripts description",
    //     command: () => [
    //         \`npx some-command\`,
    //         \`npx some-other-command\`,
    //     ],
    // },
    // "@userName/scriptsName-ThatTakesSomeParams": {
    //     description: "This will be show as scripts description",
    //     command: (projectName) => [
    //         \`npx some-command \${projectName}\`,
    //         \`cd \${projectName}\`,
    //         \`npm install\`,
    //     ],
    // }
    // Create a new script by adding a key-value pair based on examples above.
}`

export const dirNotSpecifiedStartupWarning = `Path to save strapup files is not specified. This may happen when:
${color.yellow("-")} ${color.dim("This is your first time running strapup.")}
${color.yellow("-")} ${color.dim("You haven't installed strapup globally (npm i strapup -g).")}
${color.yellow("-")} ${color.dim("Strapup has updated and erased its settings file. (Your templates are safe, you need to specify path to them again.)")}
${color.yellow("-")} ${color.dim("You have deleted strapup directory.")}`

export type StrapupSettings = {
    // strapupDirPath: string | null
    githubToken: string | null
}

export const inintialSettings: StrapupSettings = {
    // strapupDirPath: null
    githubToken: null
}

export type ScriptsFunction = (...args: string[]) => string[]

export type Scripts = {
    [key: string]: {
        description: string
        command: ScriptsFunction
    }
}
