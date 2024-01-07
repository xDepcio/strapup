'use client'

import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function getParamsAsObject(params: ReadonlyURLSearchParams) {
    const obj: { [key: string]: string } = {}
    params.forEach((value, key) => {
        obj[key] = value
    })
    return obj
}
export function useBetterQueryParams() {
    const pathname = usePathname()
    const router = useRouter()
    const currParams = useSearchParams()
    const [newParams, setNewParams] = useState(getParamsAsObject(currParams))

    useEffect(() => {
        setNewParams(getParamsAsObject(currParams))
    }, [currParams])

    useEffect(() => {
        router.replace(pathname + "?" + toString())
    }, [newParams])

    function setParam(key: string, value: string) {
        setNewParams((prev) => {
            const newParams = { ...prev }
            newParams[key] = value
            return newParams
        })
    }

    function toString() {
        return Object.entries(newParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")
    }

    return {
        params: newParams,
        setParam,
        toString,
    }
}
