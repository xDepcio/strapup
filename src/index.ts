#!/usr/bin/env node

import * as fs from 'fs'

async function main() {
    const TEMPLATO_DIR_NAME = 'templato'
    console.log("Hello World11")
    const CURR_DIR = process.cwd()
    const args = process.argv

    console.log("CURR_DIR")
    console.log(CURR_DIR)

    try {
        fs.mkdirSync(TEMPLATO_DIR_NAME)
    } catch (e) {
        console.log("e")
        console.log(e)
    }

    console.log("args")
}

main()
