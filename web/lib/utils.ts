import { clsx, type ClassValue } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function escapeName(str: string) {
    return str.replace(/\//g, "_-_")
}

export function unescapeName(str: string) {
    return str.replace(/_-_/g, "/")
}

type NewParamsType = {
    [key: string]: string | number | boolean
}
export function newQueryParams(currParams: ReadonlyURLSearchParams, newParams: NewParamsType) {
    const params = new URLSearchParams(currParams.toString())
    for (const [key, value] of Object.entries(newParams)) {
        params.set(key, value.toString())
    }
    return params
}
