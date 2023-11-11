import { normalize } from 'path'
import { loadSettings } from './utils.js'

export const STRAPUP_DIR_NAME = 'strapup'
export const TEMPLATES_PATH = () => normalize(loadSettings().strapupDirPath + `/templates`)
export const SCRIPTS_PATH = () => normalize(loadSettings().strapupDirPath + `/scripts.mjs`)
export const STRAPUP_DIR_PATH_ENV_NAME = 'STRAPUP_DIR_PATH'
export const statsUrl = "https://strapup-web.vercel.app"

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
