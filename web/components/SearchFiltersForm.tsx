"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
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
import { Check, ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { Checkbox } from "./ui/checkbox"
import { SearchResBody } from "@/app/api/search/route"
import { SearchContext } from "./Providers"
// const languages = [
//     { label: "English", value: "en" },
//     { label: "French", value: "fr" },
//     { label: "German", value: "de" },
//     { label: "Spanish", value: "es" },
//     { label: "Portuguese", value: "pt" },
//     { label: "Russian", value: "ru" },
//     { label: "Japanese", value: "ja" },
//     { label: "Korean", value: "ko" },
//     { label: "Chinese", value: "zh" },
// ] as const

const orderByOptions = [
    { label: "Stars (desc)", value: "stars-desc", icon: <ChevronsUp /> },
    { label: "Stars (asc)", value: "stars-asc", icon: <ChevronsDown /> },
] as const

const formSchema = z.object({
    keyword: z.string().min(2, {
        message: "Keyword must be at least 2 characters.",
    }),
    searchScripts: z.boolean(),
    searchTemplates: z.boolean(),
    orderBy: z.string(),
})

interface SearchFilterProps extends HTMLAttributes<HTMLFormElement> {
}
export function SearchFilters({ ...restProps }: SearchFilterProps) {
    const { setData, setLoading } = useContext(SearchContext)
    const [dbSearchTimeout, setDbSearchTimeout] = useState<NodeJS.Timeout>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()


    const searchParamsObj = {
        keyword: searchParams.get('keyword') || "",
        searchScripts: searchParams.get('searchScripts') ? searchParams.get('searchScripts') === 'true' : true,
        searchTemplates: searchParams.get('searchTemplates') ? searchParams.get('searchTemplates') === 'true' : false,
        orderBy: searchParams.get('orderBy') || "stars-desc",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyword: searchParamsObj.keyword,
            searchScripts: searchParamsObj.searchScripts,
            searchTemplates: searchParamsObj.searchTemplates,
            orderBy: searchParamsObj.orderBy,
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const queryString = Object
            .entries(values)
            .map(([key, value]) => createQueryString(key, String(value)))
            .join('&')

        router.push(pathname + '?' + queryString)
        setLoading(true)
        const timeout = setTimeout(async () => {
            console.log(values)
            const res = await fetch('/api/search', {
                method: 'POST',
                body: JSON.stringify({
                    searchString: values.keyword,
                    searchScripts: values.searchScripts,
                    searchTemplates: values.searchTemplates
                })
            })
            const data = await res.json() as SearchResBody
            setData(data)
            setLoading(false)
            console.log(data)
        }, 300)
        clearTimeout(dbSearchTimeout)
        setDbSearchTimeout(timeout)
    }

    useEffect(() => {
        if (formSchema.safeParse(form.getValues()).success) {
            form.handleSubmit(onSubmit)()
        }
    }, [])

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
                                        {/* <CommandInput placeholder="Search orderOpt..." /> */}
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
                                                    {/* <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            orderOpt.value === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    /> */}
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
                {/* <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                {/* <FormField
                    control={form.control}
                    name="searchScripts"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-1">
                            <FormLabel className="text-sm whitespace-nowrap">Search Scripts</FormLabel>
                            <FormControl>
                                <Checkbox
                                    style={{ marginTop: 0 }}
                                    className="mt-0"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                /> */}
                {/* <Button type="submit">Submit</Button> */}
            </form>
        </Form>
    )
}
