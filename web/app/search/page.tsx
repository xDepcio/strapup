'use client'

import { SearchContext } from "@/components/Providers";
import { SearchFilters } from "@/components/SearchFiltersForm";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { newQueryParams } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";
import { FaCode, FaRegStar } from "react-icons/fa";
import { MdOutlineSdStorage } from "react-icons/md";


export default function SearchPage() {
    const { data, isLoading } = useContext(SearchContext)
    const searchParams = useSearchParams()
    // const subData = useMemo(() => {
    //     const page = parseInt(searchParams.get('page') ?? '1')
    //     const perPage = parseInt(searchParams.get('perPage') ?? '10')
    //     const start = (page - 1) * perPage
    //     const end = start + perPage
    //     return {
    //         scripts: data.scripts.slice(start, end),
    //         templates: data.templates.slice(start, end),
    //     }
    // }, [data])
    // const searchParams = useBetterQueryParams()
    const formattedData = useMemo(() => {
        return [
            ...data.scripts.map(e => ({ ...e, type: 'script' })),
            ...data.templates.map(e => ({ ...e, type: 'template' })),
        ].sort((a, b) => a.stars - b.stars)
    }, [data])

    return (
        <div className="mx-auto min-h-screen grid grid-cols-[20%_auto] max-w-screen-lg mt-10 gap-4 mb-20">
            <SearchFilters className="sticky top-28 h-fit" />
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
                            <div className="flex flex-col-reverse gap-6">
                                <div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious href={{
                                                    pathname: '/search',
                                                    query: newQueryParams(searchParams, {
                                                        page: Math.max(Number(searchParams.get('page')), 2) - 1 || 1
                                                    }).toString()
                                                }} />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href={{
                                                    pathname: '/search',
                                                    query: newQueryParams(searchParams, {
                                                        page: Math.max(Number(searchParams.get('page')), 2) - 1 || 1
                                                    }).toString()
                                                }} isActive={
                                                    Number(searchParams.get('page')) === 1
                                                }>
                                                    {Math.max(Number(searchParams.get('page')), 2) - 1 || 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href={{
                                                    pathname: '/search',
                                                    query: newQueryParams(searchParams, {
                                                        page: Math.max(Number(searchParams.get('page')), 2) || 2
                                                    }).toString()
                                                }} isActive={
                                                    Number(searchParams.get('page')) !== 1
                                                }>
                                                    {Math.max(Number(searchParams.get('page')), 2) || 2}
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href={{
                                                    pathname: '/search',
                                                    query: newQueryParams(searchParams, {
                                                        page: Math.max(Number(searchParams.get('page')), 2) + 1 || 3
                                                    }).toString()
                                                }}>
                                                    {Math.max(Number(searchParams.get('page')), 2) + 1 || 3}
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext href={{
                                                    pathname: '/search',
                                                    query: newQueryParams(searchParams, {
                                                        page: Math.max(Number(searchParams.get('page')), 1) + 1 || 3
                                                    }).toString()
                                                }} />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>

                                </div>
                                <div>
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
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
