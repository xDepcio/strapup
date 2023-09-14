'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Separator } from "./ui/separator"
import { FaStar } from 'react-icons/fa'
import { BsStar } from 'react-icons/bs'
import { HiArrowLongRight } from 'react-icons/hi2'


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
        <div style={{ contain: 'strict' }}>
            <div className="sticky top-[7.04rem]">
                <h3 className="text-sm font-semibold mb-2">On this page</h3>
                <div className=" flex flex-col gap-1">
                    {linkedHeadings?.map((heading, i) => {
                        return (
                            <div key={i} className=" w-full">
                                <a href={heading.href} className={cn("text-sm text-muted-foreground hover:text-indigo-700 transition-all hover:bg-indigo-50 dark:hover:bg-zinc-900 dark:hover:text-indigo-600 py-1 px-2 rounded-md whitespace-nowrap w-full block", heading.href === highlitedHeading?.href ? "text-indigo-700 dark:bg-zinc-900 dark:text-indigo-600 bg-indigo-50" : "")}>
                                    <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                                        {heading.innerText}
                                    </p>
                                </a>
                            </div>
                        )
                    })}
                </div>
                <Separator className="mt-6 mb-6" />
                <div className="text-muted-foreground text-xs font-medium flex flex-col gap-2 pl-2">
                    <Link href={'https://github.com/xDepcio/strapup'}>
                        <div className="flex items-center gap-2 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all">
                            <p>Star us</p>
                            <BsStar />
                        </div>
                    </Link>
                    <Link href={'https://github.com/xDepcio/strapup'}>
                        <div className="flex items-center gap-2 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all">
                            <p>Contribute</p>
                            <HiArrowLongRight />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
