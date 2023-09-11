'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function PageContentNav() {
    const [linkedHeadings, setLinkedHeadings] = useState<HTMLAnchorElement[]>([])

    useEffect(() => {
        const lHeadings = document.querySelectorAll(`[aria-label="Link to section"]`)
        setLinkedHeadings(Array.from(lHeadings) as HTMLAnchorElement[])
    }, [])

    return (
        <div>
            <div className="sticky top-24">
                <h3 className="text-sm font-semibold mb-2">On this page</h3>
                <div className=" flex flex-col gap-1">
                    {linkedHeadings?.map((heading, i) => {
                        console.log(heading)
                        return (
                            <div className=" w-full">
                                <a key={i} href={heading.href} className="text-sm text-muted-foreground hover:text-indigo-700 transition-all hover:bg-indigo-50 py-1 px-2 rounded-md whitespace-nowrap w-full block ">
                                    <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                                        {heading.innerText}
                                    </p>
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
