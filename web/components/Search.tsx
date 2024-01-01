'use client'
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { CiHashtag } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";


export default function Search() {
    const searchRef = useRef<HTMLButtonElement>(null)
    const [dbSearchTimeout, setDbSearchTimeout] = useState<NodeJS.Timeout>()
    const [searchScripts, setSearchScripts] = useState<boolean>(true)
    const [searchTemplates, setSearchTemplates] = useState<boolean>(false)

    useHotkeys('ctrl+k', (e) => {
        e.preventDefault()
        searchRef.current?.click()
    })

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        const timeout = setTimeout(async () => {
            console.log('searching...')
            // await serverFn()
            // await fetchTemplatesScript({
            //     searchInput: e.target.value,
            //     searchScripts: searchScripts,
            //     searchTemplates: searchTemplates
            // })
        }, 500)
        clearTimeout(dbSearchTimeout)
        setDbSearchTimeout(timeout)
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
            <DialogContent className="max-w-[624px] top-1/3 p-0 py-2 border border-zinc-200 dark:border-zinc-900">
                <div className="">
                    <div className="border-b border-zinc-200 dark:border-zinc-900">
                        <input onChange={handleSearchInput} className="text-lg px-4 py-2 outline-none w-full dark:bg-zinc-950" placeholder="Search templates and scripts..." />
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
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-8" />
                                <Skeleton className="h-8" />
                                <Skeleton className="h-8" />
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
