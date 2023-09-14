import { allDocs } from "@/.contentlayer/generated"
import { Mdx } from "@/components/mdx-components"
import { useMDXComponent } from 'next-contentlayer/hooks'
import { redirect } from 'next/navigation'
import { MdKeyboardArrowRight } from 'react-icons/md'

const getDocBySlugs = (slugs: string[]) => {
    const pathFromSlugs = slugs.join('/')
    const doc = allDocs.find((doc) => doc._raw.flattenedPath === pathFromSlugs)
    if (!doc) return redirect('/docs/Basic use/Save and Paste')
    return doc
}

export default function DocsPage({ params }: { params: { slug?: string[] } }) {

    if (!params.slug) return redirect('/docs/Basic use/Save and Paste')
    params.slug = params.slug?.map((slug) => decodeURI(slug))

    const doc = getDocBySlugs(params.slug)

    return (
        <article className="min-h-screen pb-8 overflow-x-auto px-8 border-l">
            <div className="flex mb-4 gap-1 items-center text-sm">
                <p className="text-muted-foreground">{doc._raw.sourceFileDir}</p>
                <MdKeyboardArrowRight className="text-muted-foreground" />
                <p className="font-medium text-indigo-800 dark:bg-zinc-900 dark:text-indigo-600 bg-indigo-100 px-2 rounded-full">{doc.title}</p>
            </div>
            <Mdx code={doc?.body.code!} />
        </article>
    )
}
