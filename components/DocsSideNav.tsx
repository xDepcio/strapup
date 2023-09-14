'use client'

import { usePathname } from 'next/navigation'
import { Doc, allDocs } from "@/.contentlayer/generated";
import Link from "next/link";
import { cn } from '@/lib/utils';


export default function DocsSideNav() {
    const sortedArr = allDocs.sort((a, b) => a.sortNum - b.sortNum)
    const path = decodeURI(usePathname())

    const categorizedDocs = sortedArr.reduce((acc: { [key: Doc['_raw']['sourceFileDir']]: Doc[] }, doc) => {
        const currCatContent = acc[doc._raw.sourceFileDir]
        return {
            ...acc,
            [doc._raw.sourceFileDir]: [...(currCatContent ? currCatContent : []), doc]
        }
    }, {})

    return (
        <div className="relative pr-6">
            <div className='sticky top-[7.04rem] text-sm'>
                {Object.entries(categorizedDocs).map(([cat, docs], i) => {
                    return (
                        <div key={i} className="mb-4">
                            <p className="text-foreground font-semibold mb-2">{cat}</p>
                            <div className="flex flex-col gap-1">
                                {docs.map((doc, j) => {
                                    const isActive = path === `/docs/${doc._raw.flattenedPath}`

                                    return <Link key={j} style={{ contain: "inline-size" }} href={`/docs/${doc._raw.flattenedPath}`} className={cn("ml-0 text-muted-foreground hover:text-indigo-700 dark:hover:text-indigo-600 transition-all hover:bg-indigo-50 py-1 px-2 rounded-md text-ellipsis whitespace-nowrap overflow-hidden dark:hover:bg-zinc-900", isActive ? "bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-600 text-indigo-700" : "")}>{doc.title}</Link>
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
