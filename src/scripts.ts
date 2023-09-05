export const scripts = {
    nextshad: (projectName: string) => [
        `npx create-next-app ${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`,
        `cd ${projectName}`,
        `npx shadcn-ui@latest init -y`,
        `strapup paste redux-ts redux`
    ],
    expressts: (...params: string[]) => [
        `npx bootstrap-express-ts ${params[0]}`,
    ],
    shadcn: () => [
        `npx shadcn-ui@latest init -y`,
    ]
}
