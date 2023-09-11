import { allDocs } from "@/.contentlayer/generated"
import { Mdx } from "@/components/mdx-components"
import { useMDXComponent } from 'next-contentlayer/hooks'
import { redirect } from 'next/navigation'

const getDocBySlugs = (slugs: string[]) => {
    const pathFromSlugs = slugs.join('/')
    const doc = allDocs.find((doc) => doc._raw.flattenedPath === pathFromSlugs)
    if (!doc) return redirect('/')
    return doc
}

export default function DocsPage({ params }: { params: { slug?: string[] } }) {

    if (!params.slug) return redirect('/docs/instalation')
    params.slug = params.slug?.map((slug) => decodeURI(slug))

    const doc = getDocBySlugs(params.slug)

    const MDXContent = useMDXComponent(doc.body.code)

    return (
        <div className="min-h-screen">
            <div>

            </div>
            <h1 className="text-4xl font-bold mb-8 tracking-tight">Tracking conversions for your components</h1>
            <Mdx code={doc?.body.code!} />
        </div>
    )
}
