'use client'

import { cn } from "@/lib/utils"
import { useMDXComponent } from "next-contentlayer/hooks"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import toast from "react-hot-toast"
import { BsLink45Deg } from 'react-icons/bs'
import { FiBookOpen, FiCopy } from "react-icons/fi"
import { IoArrowForwardOutline } from 'react-icons/io5'

interface NextCardHolderProps {
    cards: {
        title: string
        description: string
        link: string
        iconType?: 'arrow' | 'book'
    }[]
}

function NextCardHolder({ cards }: NextCardHolderProps) {
    return (
        <div id="grid-card" className="grid grid-cols-2 gap-4 mt-6">
            {cards.map(({ description, iconType = 'arrow', link, title }, index) => (
                <Link href={link} key={index} className="flex flex-col border px-4 py-3 rounded-lg shadow-lg cursor-pointer">
                    <div className="flex flex-row-reverse justify-between gap-2">
                        <h3 className="text-lg font-semibold text-left">{title}</h3>
                        {iconType === 'arrow' && <IoArrowForwardOutline className="text-3xl" />}
                        {iconType === 'book' && <FiBookOpen className="text-3xl" />}
                    </div>
                    <p className="text-base text-left">{description}</p>
                </Link>
            ))}
        </div>
    )
}

const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn(
                "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className={cn(
                "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h4
            className={cn(
                "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h6
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => {
        if (props['aria-label'] === "Link to section") {
            return <a
                className={cn("group flex items-center gap-1 relative", className)}
                {...props}
            >
                <BsLink45Deg className="absolute -left-6 group-hover:visible invisible" />
                {props.children}
            </a>
        }

        return <a
            className={cn("font-medium underline underline-offset-4", className)}
            {...props}
        />
    },
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className={cn(
                "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
                className
            )}
            {...props}
        />
    ),
    img: ({
        className,
        alt,
        ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={cn("rounded-md border mt-4", className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-muted", className)}
            {...props}
        />
    ),
    th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
        // @ts-ignore
        if (props['data-language'] === 'command') return <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg bg-indigo-50 dark:bg-zinc-900 dark:text-zinc-50",
                className
            )}
            {...props}
        />

        return <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg bg-indigo-50 py-4 dark:bg-zinc-900 dark:text-zinc-50",
                className
            )}
            {...props}
        />
    },
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
        // @ts-ignore
        if (props['data-language'] === 'command') return <code
            className={cn(
                "relative rounded px-[1rem] py-[0.5rem] font-mono bg-indigo-50 dark:bg-zinc-900",
                className
            )}
            {...props}
        >
            <FiCopy onClick={() => toast.success('copied! 📝')} className="absolute top-1/2 -translate-y-1/2 right-1 hover:bg-indigo-200 p-2 rounded-md box-content transition-all cursor-pointer" />
            {props.children}
        </code>

        return <code
            className={cn(
                "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm bg-indigo-50 dark:bg-zinc-900",
                className
            )}
            {...props}
        />
    },
    Image,
    NextCardHolder
}

interface MdxProps {
    code: string
}

export function Mdx({ code }: MdxProps) {
    const Component = useMDXComponent(code)

    return (
        <div className="mdx">
            <Component components={components} />
        </div>
    )
}
