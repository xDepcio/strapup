'use client'

import { SearchContext } from "@/components/Providers";
import { SearchFilters } from "@/components/SearchFiltersForm"
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useMemo } from "react";
import { FaCode } from "react-icons/fa";
import { MdOutlineSdStorage } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBetterQueryParams } from "@/hooks/utility";
import { newQueryParams } from "@/lib/utils";


export default function SearchPage() {
    const { data, isLoading } = useContext(SearchContext)
    const searchParams = useSearchParams()
    // const searchParams = useBetterQueryParams()
    const formattedData = useMemo(() => {
        return [
            ...data.scripts.map(e => ({ ...e, type: 'script' })),
            ...data.templates.map(e => ({ ...e, type: 'template' })),
        ].sort((a, b) => a.stars - b.stars)
    }, [data])

    return (
        <div className="mx-auto min-h-screen grid grid-cols-[20%_auto] max-w-screen-lg mt-10 gap-4">
            <SearchFilters />
            <div className="flex gap-4 h-fit flex-col">
                {isLoading ? (
                    <>
                        <Skeleton className="w-full h-40" />
                        <Skeleton className="w-full h-40" />
                        <Skeleton className="w-full h-40" />
                        <Skeleton className="w-full h-40" />
                    </>
                ) : (
                    <>
                        {formattedData.length === 0 ? (
                            <div>no results</div>
                        ) : (
                            <>
                                {formattedData.map((entry) => (
                                    <div key={entry.name} className="flex gap-4 flex-col justify-center border-b dark:border-zinc-800 border-zinc-200 p-4 ">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/${entry.type === 'script' ? 'scripts' : 'templates'}/${entry.id}`}>
                                                <h4 className="cursor-pointer hover:underline scroll-m-20 text-lg font-semibold tracking-tight">{entry.name}</h4>
                                            </Link>
                                            {entry.type === 'script' ? (
                                                <div className="w-fit bg-indigo-200 flex items-center gap-1 rounded-full px-2 py-[2px] text-xs text-indigo-800">
                                                    <FaCode />
                                                    <p>script</p>
                                                </div>
                                            ) : (
                                                <div className="w-fit bg-indigo-200 flex items-center gap-1 rounded-full px-2 py-[2px] text-xs text-indigo-800">
                                                    <MdOutlineSdStorage />
                                                    <p>template</p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-xs bg-yellow-200 px-2 py-[2px] rounded-full text-yellow-800">
                                                <FaRegStar />
                                                <p className="">{entry.stars}</p>
                                            </div>
                                        </div>
                                        <p className="text-ellipsis overflow-hidden line-clamp-2 max-w-[60ch]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora aut non cupiditate porro in! Laborum repellendus, molestias enim voluptatibus doloribus nulla corrupti iure quod perferendis maiores? Impedit laborum in odit!</p>
                                        <div className="flex gap-2">
                                            {entry.tags.split(' ').map((tag, i) => (
                                                <Link href={`/search?${newQueryParams(searchParams, { keyword: tag })}`} className="dark:bg-zinc-800 bg-zinc-200 px-2 py-[2px] rounded-md text-sm"
                                                    key={i}>
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
