import { clsx, type ClassValue } from "clsx"
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
