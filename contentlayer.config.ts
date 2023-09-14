import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePreetyCode from 'rehype-pretty-code'

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

export default makeSource({
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
