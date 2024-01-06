'use client'

import { SearchContext } from "@/components/Providers";
import { SearchFilters } from "@/components/SearchFiltersForm"
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useMemo } from "react";

export default function SearchPage() {
    const { data, isLoading } = useContext(SearchContext)
    const formattedData = useMemo(() => {
        return [
            ...data.scripts.map(e => ({ ...e, type: 'script' })),
            ...data.templates.map(e => ({ ...e, type: 'template' })),
        ].sort((a, b) => a.stars - b.stars)
    }, [data])

    return (
        <div className="mx-auto min-h-screen grid grid-cols-[20%_auto] max-w-screen-lg mt-10 gap-4">
            <SearchFilters />
            <div className="flex gap-2 h-fit flex-col">
                {isLoading ? (
                    <>
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                    </>
                ) : (
                    <>
                        {formattedData.length === 0 ? (
                            <div>no results</div>
                        ) : (
                            <>
                                {formattedData.map((entry) => (
                                    <div key={entry.id} className="flex items-center space-x-4">
                                        <p className="text-sm text-muted-foreground">{entry.type}</p>
                                        <p className="text-sm text-muted-foreground">{entry.name}</p>
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
