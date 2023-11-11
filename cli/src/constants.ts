import color from 'picocolors'
import { loadSettings } from './utils.js'
import { normalize } from 'path'
import { __dirname } from './index.js'

export const STRAPUP_DIR_NAME = 'strapup'
export const TEMPLATES_PATH = () => normalize(loadSettings().strapupDirPath + `/templates`)
export const SCRIPTS_PATH = () => normalize(loadSettings().strapupDirPath + `/scripts.mjs`)
export const premadeTemplatesDirPath = () => normalize(`${__dirname}/premade-templates`)
export const STRAPUP_DIR_PATH_ENV_NAME = 'STRAPUP_DIR_PATH'
export const statsUrl = "https://strapup-web.vercel.app"

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

export const dirNotSpecifiedStartupWarning = `Path to save strapup files is not specified. This may happen when:
${color.yellow("-")} ${color.dim("This is your first time running strapup.")}
${color.yellow("-")} ${color.dim("You haven't installed strapup globally (npm i strapup -g).")}
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
    [key: string]: {
        description: string
        command: ScriptsFunction
    }
}
