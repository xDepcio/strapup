export const scripts = {
    nextshad: (name: string) => [
        `npx create-next-app ${name} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`,
        `cd ${name}`,
        `npx shadcn-ui@latest init -y`,
        `templato paste redux-ts redux`
    ],
    expressts: (...params: string[]) => [
        `npx bootstrap-express-ts ${params[0]}`,
    ],
}
