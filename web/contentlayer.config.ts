import { defineDocumentType } from 'contentlayer/source-files'
import { makeSource } from 'contentlayer/source-remote-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePreetyCode from 'rehype-pretty-code'
import { spawn } from 'child_process'

export const Doc = defineDocumentType(() => ({
    name: 'Doc',
    filePathPattern: `**/*.mdx`,
    fields: {
        title: { type: 'string', required: true },
        sortNum: { type: 'number', required: true },
    },
    computedFields: {
        slug: { type: 'string', resolve: (doc) => `/${doc._raw.flattenedPath}` },
        slugAsParams: { type: 'string', resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/') },
    },
    contentType: 'mdx'
}))

const syncContentFromGit = async (contentDir: string) => {
    const syncRun = async () => {
        const gitUrl = 'https://github.com/vercel/next.js.git'
        await runBashCommand(`echo "Syncing content from git"`)
        //     await runBashCommand(`
        //     if [ -d  "${contentDir}" ];
        //       then
        //         cd "${contentDir}"; git pull;
        //       else
        //         git clone --depth 1 --single-branch ${gitUrl} ${contentDir};
        //     fi
        //   `)
    }

    let wasCancelled = false
    // @ts-ignore
    let syncInterval

    const syncLoop = async () => {
        console.log('Syncing content files from git')

        await syncRun()

        if (wasCancelled) return

        syncInterval = setTimeout(syncLoop, 1000 * 60)
    }

    // Block until the first sync is done
    await syncLoop()

    return () => {
        wasCancelled = true
        // @ts-ignore
        clearTimeout(syncInterval)
    }
}

const runBashCommand = (command: string) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, [], { shell: true })

        child.stdout.setEncoding('utf8')
        child.stdout.on('data', (data) => process.stdout.write(data))

        child.stderr.setEncoding('utf8')
        child.stderr.on('data', (data) => process.stderr.write(data))

        child.on('close', function (code) {
            if (code === 0) {
                resolve(void 0)
            } else {
                reject(new Error(`Command failed with exit code ${code}`))
            }
        })
    })



export default makeSource({
    syncFiles: syncContentFromGit,
    contentDirPath: 'docs',
    documentTypes: [Doc],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [
                rehypePreetyCode,
                {
                    theme: {
                        light: 'github-light',
                        dark: 'github-dark'
                    },
                    keepBackground: false,
                    onVisitLine: (node: any) => {
                        if (node.children.length === 0) {
                            node.children = [{ type: 'text', value: ' ' }]
                        }
                    },
                    onVisitHighlightedLine: (node: any) => {
                        node.properties.className.push('line--highlighted')
                    },
                    onVisitHighlitedWord: (node: any) => {
                        node.properties.className = ['word--highlighted']
                    }
                }
            ],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'wrap',
                    properties: {
                        className: ['subheading--anchor'],
                        ariaLabel: 'Link to section'
                    }
                }
            ]
        ]
    }
})
