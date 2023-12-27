'use client'
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa";
import { CiHashtag } from "react-icons/ci";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BiEnvelope } from "react-icons/bi";
import { Skeleton } from "./ui/skeleton";

export default function Search() {
    const [showSearch, setShowSearch] = useState(false)

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button onClick={() => setShowSearch(true)} className="dark:bg-zinc-900 bg-zinc-100 flex text-muted-foreground text-sm items-center justify-between px-4 py-2 gap-8 rounded-md">
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
                            <input className="text-lg px-4 py-2 outline-none w-full dark:bg-zinc-950" placeholder="Search templates and scripts..." />
                        </div>
                        <div className="p-4">
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
        </>
    )
}
