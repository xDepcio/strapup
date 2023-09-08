import color from 'picocolors'
import { loadSettings } from './utils.js'
import { __dirname } from './index.js'

export const STRAPUP_DIR_NAME = 'strapup'
export const TEMPLATES_PATH = () => loadSettings().strapupDirPath + `/templates`
export const SCRIPTS_PATH = () => loadSettings().strapupDirPath + `/scripts.mjs`
export const premadeTemplatesDirPath = () => `${__dirname}/premade-templates`

export const scriptsContent = `export const scripts = {
    nextshadreduxts: {
        description: "Create new Next.js app dir, Tailwind, Typescript, Shadcn UI, Redux Toolkit",
        command: (projectName) => [
            \`npx create-next-app \${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"\`,
            \`cd \${projectName}\`,
            \`npx shadcn-ui@latest init -y\`,
            \`strapup paste next-redux-ts redux\`
        ],
    },
    shadcn: {
        description: "Add Shadcn UI to existing project with basic components (button, input, skeleton)",
        command: () => [
            \`npx shadcn-ui@latest init -y\`,
            \`npx shadcn-ui@latest add button -y\`,
            \`npx shadcn-ui@latest add input -y\`,
            \`npx shadcn-ui@latest add skeleton -y\`,
        ],
    },
    nextJsShadcnAuthJs: {
        description: "Create new Next.js typescript, app dir, tailwind, no src dir, shadcn, basic Auth.js",
        command: (projectName) => [
            \`npx create-next-app \${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"\`,
            \`cd \${projectName}\`,
            \`npx shadcn-ui@latest init -y\`,
            \`npx shadcn-ui@latest add button -y\`,
            \`npx shadcn-ui@latest add input -y\`,
            \`npx shadcn-ui@latest add skeleton -y\`,
            \`npm i next-auth\`,
            \`strapup paste next13-app-auth-paste-from-root ./\`,
        ]
    },
    nextJsShadcnAuthJsRTKTS: {
        description: "Create new Next.js typescript, app dir, tailwind, no src dir, shadcn, basic Auth.js, basic redux-toolkit",
        command: (projectName) => [
            \`npx create-next-app \${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"\`,
            \`cd \${projectName}\`,
            \`npx shadcn-ui@latest init -y\`,
            \`npx shadcn-ui@latest add button -y\`,
            \`npx shadcn-ui@latest add input -y\`,
            \`npx shadcn-ui@latest add skeleton -y\`,
            \`npm i next-auth\`,
            \`strapup paste next13-app-auth-paste-from-root ./\`,
            \`strapup paste next-redux-ts redux\`,
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
