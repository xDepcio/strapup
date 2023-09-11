'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PageContentNav() {
    const [linkedHeadings, setLinkedHeadings] = useState<HTMLAnchorElement[]>([])
    const [highlitedHeading, setHighlitedHeading] = useState<HTMLAnchorElement | null>(null)

    useEffect(() => {
        const lHeadings = document.querySelectorAll(`[aria-label="Link to section"]`)
        const mainNav = document.getElementById('main-nav')
        console.log("mainNav", mainNav)
        lHeadings.forEach((heading) => {
            const observer = new IntersectionObserver((entries) => {
                console.log("ee", entries)
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setHighlitedHeading(heading as HTMLAnchorElement)
                    }
                })
            }, { root: null, rootMargin: "0px 0px -80% 0px", threshold: 1 })
            observer.observe(heading)
        })
        setLinkedHeadings(Array.from(lHeadings) as HTMLAnchorElement[])
    }, [])

    return (
        <div>
            <div className="sticky top-24">
                <h3 className="text-sm font-semibold mb-2">On this page</h3>
                {/* <h3 className="text-sm font-semibold mb-2">{highlitedHeading?.href}</h3> */}
                <div className=" flex flex-col gap-1">
                    {linkedHeadings?.map((heading, i) => {
                        // console.log(heading)
                        return (
                            <div className=" w-full">
                                <a key={i} href={heading.href} className={cn("text-sm text-muted-foreground hover:text-indigo-700 transition-all hover:bg-indigo-50 py-1 px-2 rounded-md whitespace-nowrap w-full block", heading.href === highlitedHeading?.href ? "text-indigo-700 bg-indigo-50" : "")}>
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
