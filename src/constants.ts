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
