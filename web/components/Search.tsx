'use client'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    closeDialog
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { CiHashtag } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { SearchResBody } from "@/app/api/search/route";
import { FaCode } from "react-icons/fa6";
import { MdOutlineStorage } from "react-icons/md";
import { cn } from "@/lib/utils";
import { FaRegStar } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchResBodyData } from "./Providers";

export default function Search() {
    const searchRef = useRef<HTMLButtonElement>(null)
    const [dbSearchTimeout, setDbSearchTimeout] = useState<NodeJS.Timeout>()
    const [searchScripts, setSearchScripts] = useState<boolean>(true)
    const [searchTemplates, setSearchTemplates] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<SearchResBodyData>()
    const [searchInput, setSearchInput] = useState<string>('')
    const router = useRouter()
    // useEffect(() => {
    //     setSearchResults({
    //         scripts: [
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             }
    //         ],
    //         templates: [
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             },
    //             {
    //                 name: 'Create-Next-App-ShadCN',
    //                 tags: 'Next React Shadcn Prisma Typescript Tailwind',
    //                 stars: 0,
    //             }
    //         ]
    //     })
    // }, [])

    useHotkeys('ctrl+k', (e) => {
        e.preventDefault()
        searchRef.current?.click()
    })

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value)
        setSearchResults(undefined)
        const timeout = setTimeout(async () => {
            console.log('searching...')
            const res = await fetch('/api/search', {
                method: 'POST',
                body: JSON.stringify({
                    searchString: e.target.value,
                    searchScripts,
                    searchTemplates
                })
            })
            const data = await res.json() as SearchResBody
            if (data.error) {
                console.error(data.error)
                return
            }
            setSearchResults(data as SearchResBodyData)

        }, 500)
        clearTimeout(dbSearchTimeout)
        setDbSearchTimeout(timeout)
    }

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // console.log(e.currentTarget.val)
        router.push(`/search?keyword=${searchInput}&searchScripts=${searchScripts}&searchTemplates=${searchTemplates}`)
        closeDialog()
    }

    return (
        <Dialog>
            <DialogTrigger asChild ref={searchRef}>
                <button className="dark:bg-zinc-900 bg-zinc-100 flex text-muted-foreground text-sm items-center justify-between px-4 py-2 gap-8 rounded-md">
                    <div className="flex items-center justify-center gap-2">
                        <FaSearch />
                        <p className="">Search templates/scripts...</p>
                    </div>
                    <p className="dark:bg-zinc-950 dark:border-zinc-500 dark:text-zinc-50 p-0 text-xs font-medium bg-white px-2 py-[2px] rounded-full text-zinc-950 border border-zinc-200">
                        Ctrl+K
                    </p>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[624px] top-1/2 p-0 py-2 border border-zinc-200 dark:border-zinc-900 max-h-[75vh]">
                <div className="">
                    <div className="border-b border-zinc-200 dark:border-zinc-900">
                        <form onSubmit={handleSearchSubmit}>
                            <input onChange={handleSearchInput} value={searchInput} className="text-lg px-4 py-2 outline-none w-full dark:bg-zinc-950" placeholder="Search templates and scripts..." />
                        </form>
                    </div>
                    <div className="p-4">
                        <div className="mb-4 flex items-center gap-4 text-muted-foreground">
                            <Label className="flex items-center gap-2">
                                <Switch defaultChecked onClick={() => setSearchScripts(!searchScripts)} />
                                <p>Search scripts</p>
                            </Label>
                            <Label className="flex items-center gap-2">
                                <Switch onClick={() => setSearchTemplates(!searchTemplates)} />
                                <p>Search templates</p>
                            </Label>
                        </div>
                        <div>
                            <p className="font-bold text-xs mb-2">Results</p>
                            <div className="overflow-y-auto max-h-[32vh] flex flex-col gap-1">
                                {searchResults ? (
                                    <>
                                        {
                                            [
                                                ...searchResults.scripts.map(e => ({ ...e, type: 'script' })),
                                                ...searchResults.templates.map(e => ({ ...e, type: 'template' })),
                                            ].map((entry, i) => (
                                                <Link href={entry.type === 'script' ? `/scripts/${entry.id}` : `/templates/${entry.id}`} onClick={closeDialog}>
                                                    <div key={i} className="flex flex-col dark:hover:bg-zinc-900 hover:bg-zinc-100 rounded-md p-2 cursor-pointer gap-1">
                                                        <div className="flex gap-4 justify-start">
                                                            <p className="text-sm">{entry.name}</p>
                                                            <div className="flex items-center gap-2 text-xs w-fit rounded-full px-2 py-[2px] h-fit border text-muted-foreground">
                                                                {entry.type === 'template' ? <MdOutlineStorage /> : <FaCode />}
                                                                <p>{entry.type === 'template' ? 'Template' : 'Script'}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs w-fit rounded-full px-2 py-[2px] h-fit border text-muted-foreground">
                                                                <FaRegStar />
                                                                <p className="text-xs text-muted-foreground">{entry.stars}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground text-ellipsis max-w-[70%] overflow-hidden">{entry.tags?.split(' ').join('\u00A0\u00A0')}</p>
                                                    </div>
                                                </Link>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <>
                                        <Skeleton className="h-8" />
                                        <Skeleton className="h-8" />
                                        <Skeleton className="h-8" />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-xs mb-1 mt-4">Popular tags</p>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md dark:hover:bg-zinc-900 cursor-pointer text-muted-foreground">
                                    <CiHashtag />
                                    <p>React</p>
                                </div>
                                <div className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md dark:hover:bg-zinc-900 cursor-pointer text-muted-foreground">
                                    <CiHashtag />
                                    <p>Next</p>
                                </div>
                                <div className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md dark:hover:bg-zinc-900 cursor-pointer text-muted-foreground">
                                    <CiHashtag />
                                    <p>Python</p>
                                </div>
                                <div className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md dark:hover:bg-zinc-900 cursor-pointer text-muted-foreground">
                                    <CiHashtag />
                                    <p>Express</p>
                                </div>
                                <div className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md dark:hover:bg-zinc-900 cursor-pointer text-muted-foreground">
                                    <CiHashtag />
                                    <p>Flask</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
