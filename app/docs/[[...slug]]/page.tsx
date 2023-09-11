import { allDocs } from "@/.contentlayer/generated"
import { Mdx } from "@/components/mdx-components"
import { useMDXComponent } from 'next-contentlayer/hooks'
import { redirect } from 'next/navigation'
import { MdKeyboardArrowRight } from 'react-icons/md'

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

    console.log("MDXContent", doc)

    return (
        <div className="min-h-screen">
            <div className="flex mb-4 gap-1 items-center">
                <p className="text-muted-foreground">{doc._raw.sourceFileDir}</p>
                <MdKeyboardArrowRight className="text-muted-foreground" />
                <p className="font-medium text-indigo-800 bg-indigo-100 px-2 rounded-full">{doc.title}</p>
            </div>
            <Mdx code={doc?.body.code!} />
        </div>
    )
}
