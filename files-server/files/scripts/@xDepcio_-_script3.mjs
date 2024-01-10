function isUnix() {
    return process.platform === "linux" || process.platform === "darwin";
}

export default {
    description: "This is a script (@xDepcio/script3)",
    command: () => [
        `echo 'Hello World! Starting...'`,
        isUnix() ? `echo 'unix based - OK CONTINUE'` : `not unix based - NOT OK, TERMINATING; exit 1`,
        `echo 'CONTINUED'`,
    ]
}
