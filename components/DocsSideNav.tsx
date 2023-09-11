import { Doc, allDocs } from "@/.contentlayer/generated";
import Link from "next/link";


export default function DocsSideNav() {
    const allDocsRest = allDocs.map((doc) => ({ ...doc, body: undefined }))
    console.log("DDDD", allDocsRest)

    const dd = allDocs.reduce((acc: { [key: Doc['_raw']['sourceFileDir']]: Doc[] }, doc) => {
        const currCatContent = acc[doc._raw.sourceFileDir]
        return {
            ...acc,
            [doc._raw.sourceFileDir]: [...(currCatContent ? currCatContent : []), doc]
        }
    }, {})
    console.log("XXX", dd)

    return (
        <div className="border-r-[1px] pr-4">
            {Object.entries(dd).map(([cat, docs]) => {
                return (
                    <div className="mb-4">
                        <p className="text-foreground font-semibold">{cat}</p>
                        <div className="flex flex-col">
                            {docs.map((doc) => {
                                return <Link href={`/docs/${doc._raw.flattenedPath}`} className="ml-0 text-muted-foreground hover:text-indigo-700 transition-all hover:bg-indigo-50 py-1 px-2 rounded-md">{doc.title}</Link>
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
