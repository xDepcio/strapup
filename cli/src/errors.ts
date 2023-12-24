class TypedError<T = undefined> extends Error {
    public name: string
    public data: T

    constructor({ name, message, data }:
        { name: string, message: string, data?: T }) {
        super(message)
        this.name = name
        this.data = data as T
        Error.captureStackTrace(this, TypedError)
    }
}

export class DirectoryNotExists extends TypedError<{ path: string }> {
    constructor(path: string) {
        super({
            message: "Directory doesn't exist",
            name: 'SaveError',
            data: { path }
        })
    }
}

export class ToDownloadScriptNotFound extends TypedError<{ scriptName: string }> {
    constructor(scriptName: string) {
        super({
            message: `Script ${scriptName} not found.`,
            name: 'DownloadError',
            data: { scriptName }
        })
    }
}
