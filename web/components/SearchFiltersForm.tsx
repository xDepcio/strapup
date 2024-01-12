"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { SearchResBody } from "@/app/api/search/route"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { SearchContext, SearchResBodyData } from "./Providers"
import { Checkbox } from "./ui/checkbox"

type SearchQueryParams = {
    keyword: string
    searchScripts: string
    searchTemplates: string
    orderBy: string
    page: string
    pageSize: string
}

const orderByOptions = [
    { label: "Stars (desc)", value: "stars-desc", icon: <ChevronsDown /> },
    { label: "Stars (asc)", value: "stars-asc", icon: <ChevronsUp /> },
] as const

const formSchema = z.object({
    keyword: z.string(),
    searchScripts: z.boolean(),
    searchTemplates: z.boolean(),
    orderBy: z.string(),
    page: z.number(),
    pageSize: z.number(),
})

interface SearchFilterProps extends HTMLAttributes<HTMLFormElement> {
}
export function SearchFilters({ ...restProps }: SearchFilterProps) {
    const { setData, setLoading } = useContext(SearchContext)
    const [dbSearchTimeout, setDbSearchTimeout] = useState<NodeJS.Timeout>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()


    const [searchParamsObj, setSearchParamsObj] = useState({
        keyword: searchParams.get('keyword') || "",
        searchScripts: searchParams.get('searchScripts') ? searchParams.get('searchScripts') === 'true' : true,
        searchTemplates: searchParams.get('searchTemplates') ? searchParams.get('searchTemplates') === 'true' : false,
        orderBy: searchParams.get('orderBy') || "stars-desc",
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyword: searchParamsObj.keyword,
            searchScripts: searchParamsObj.searchScripts,
            searchTemplates: searchParamsObj.searchTemplates,
            orderBy: searchParamsObj.orderBy,
            page: searchParamsObj.page,
            pageSize: searchParamsObj.pageSize,
        },
    })

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams()
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    function retFormParams() {
        return {
            keyword: searchParams.get('keyword') || "",
            searchScripts: searchParams.get('searchScripts') ? searchParams.get('searchScripts') === 'true' : true,
            searchTemplates: searchParams.get('searchTemplates') ? searchParams.get('searchTemplates') === 'true' : false,
            orderBy: searchParams.get('orderBy') || "stars-desc",
            page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10
        }
    }

    useEffect(() => {
        console.log("BEFORE UPDATE", searchParamsObj)
        const newParams = retFormParams()
        setSearchParamsObj(newParams)
        console.log("AFTER UPDATE", newParams)
        form.setValue('keyword', newParams.keyword)
        form.setValue('searchScripts', newParams.searchScripts)
        form.setValue('searchTemplates', newParams.searchTemplates)
        form.setValue('orderBy', newParams.orderBy)
        form.setValue('page', newParams.page)
        form.setValue('pageSize', newParams.pageSize)
        form.handleSubmit(onSubmit)()
    }, [searchParams])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const queryString = Object
            .entries(values)
            .map(([key, value]) => createQueryString(key, String(value)))
            .join('&')

        router.replace(pathname + '?' + queryString)
        setLoading(true)
        const timeout = setTimeout(async () => {
            console.log(values)
            const res = await fetch('/api/search', {
                method: 'POST',
                body: JSON.stringify({
                    searchString: values.keyword,
                    searchScripts: values.searchScripts,
                    searchTemplates: values.searchTemplates,
                    page: values.page,
                    pageSize: values.pageSize,
                    orderBy: values.orderBy
                })
            })
            const data = await res.json() as SearchResBody
            if (data.error) {
                console.error(data.error)
                return
            }
            setData(data as SearchResBodyData)
            setLoading(false)
            console.log(data)
        }, 300)
        clearTimeout(dbSearchTimeout)
        setDbSearchTimeout(timeout)
    }

    return (
        <Form {...form}>
            <form {...restProps} onChange={form.handleSubmit(onSubmit)} onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col", restProps.className)}>
                <FormField
                    control={form.control}
                    name="orderBy"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Order by</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? orderByOptions.find(
                                                    (orderOpt) => orderOpt.value === field.value
                                                )?.label
                                                : "Select orderOpt"}
                                            {field.value
                                                ? orderByOptions.find(
                                                    orderOpt => orderOpt.value === field.value
                                                )?.icon as ReactNode
                                                : <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandEmpty>No orderOpt found.</CommandEmpty>
                                        <CommandGroup>
                                            {orderByOptions.map((orderOpt) => (
                                                <CommandItem
                                                    value={orderOpt.label}
                                                    key={orderOpt.value}
                                                    onSelect={() => {
                                                        form.setValue("orderBy", orderOpt.value)
                                                        form.handleSubmit(onSubmit)()
                                                    }}
                                                >
                                                    {orderOpt.icon}
                                                    {orderOpt.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="keyword"
                    render={({ field }) => (
                        <FormItem className="mt-6">
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                                <Input className="" placeholder="@xDepcio next react..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Space seperated values like names or tags
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="searchScripts"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-1 mt-6">
                            <FormLabel className="text-sm whitespace-nowrap">Search Scripts</FormLabel>
                            <FormControl>
                                <Checkbox
                                    style={{ marginTop: 0 }}
                                    className=""
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="searchTemplates"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-1 mt-2">
                            <FormLabel className="text-sm whitespace-nowrap">Search Templates</FormLabel>
                            <FormControl>
                                <Checkbox
                                    style={{ marginTop: 0 }}
                                    className=""
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
