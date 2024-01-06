'use client'

import { SearchContext } from "@/components/Providers";
import { SearchFilters } from "@/components/SearchFiltersForm"
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";

export default function SearchPage() {
    const { data, isLoading } = useContext(SearchContext)
    return (
        <div className="mx-auto min-h-screen grid grid-cols-[20%_auto] max-w-screen-lg mt-10">
            <SearchFilters />
            <div>
                {isLoading ? (
                    <>
                        <Skeleton className="w-full h-20" />
                    </>
                ) : (
                    <>
                        {data.scripts.map((script) => (
                            <div key={script.id} className="flex items-center space-x-4">
                                <p className="text-sm text-muted-foreground">Script</p>
                                <p className="text-sm text-muted-foreground">{script.name}</p>
                            </div>
                        ))}
                        {data.templates.map((template) => (
                            <div key={template.id} className="flex items-center space-x-4">
                                <p className="text-sm text-muted-foreground">Template</p>
                                <p className="text-sm text-muted-foreground">{template.name}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
