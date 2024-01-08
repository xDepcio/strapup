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
// export function useBetterQueryParams() {
//     const pathname = usePathname()
//     const router = useRouter()
//     const currParams = useSearchParams()
//     const [newParams, setNewParams] = useState(getParamsAsObject(currParams))

//     useEffect(() => {
//         setNewParams(getParamsAsObject(currParams))
//     }, [currParams])

//     useEffect(() => {
//         router.replace(pathname + "?" + toString())
//     }, [newParams])

//     function setParam(key: string, value: string) {
//         setNewParams((prev) => {
//             const newParams = { ...prev }
//             newParams[key] = value
//             return newParams
//         })
//     }

//     function toString() {
//         return Object.entries(newParams)
//             .map(([key, value]) => `${key}=${value}`)
//             .join("&")
//     }

//     return {
//         params: newParams,
//         setParam,
//         toString,
//     }
// }

type StringToTypeMap = {
    string: string,
    number: number,
    boolean: boolean
};

type TypeOfKey<T, K extends keyof T> = T[K] extends string ? 'string'
    : T[K] extends number ? 'number'
    : T[K] extends boolean ? 'boolean'
    : never;
function _getParamsAsObject<T>(params: ReadonlyURLSearchParams) {
    const obj: { [key: string]: string } = {}
    params.forEach((value, key) => {
        obj[key] = value
    })
    return obj as T
}
function parseParams<T extends Record<string, string | number | boolean>>(params: ReadonlyURLSearchParams) {
    // @ts-ignore
    const obj: T = {}
    params.forEach((value, key) => {
        if (value === 'true' || value === 'false') {
            // @ts-ignore
            obj[key] = value === 'true' as any;
        }
        else if (!isNaN(parseFloat(value))) {
            // @ts-ignore
            obj[key] = parseFloat(value) as any;
        }
        else {
            // @ts-ignore
            obj[key] = value as any;
        }
        // const type = typeof obj[key as keyof T] as keyof StringToTypeMap;
        // console.log(type)
        // // @ts-ignore
        // switch (type) {
        //     case 'number':
        //         obj[key as keyof T] = parseFloat(value) as any;
        //         break;
        //     case 'boolean':
        //         // @ts-ignore
        //         obj[key as keyof T] = value === 'true' as any;
        //         break;
        //     default:
        //         obj[key as keyof T] = value as any;
        //         break;
        // }
    })
    return obj as T
}
// export function useBetterSearchParams<T extends Record<string, string | number | boolean>>() {
//     const pathname = usePathname()
//     const router = useRouter()
//     const currParams = useSearchParams()
//     const [paramsState, setParamsState] = useState<T>(parseParams<T>(currParams))

//     // function setParams(params: T) {

//     // }
//     // function setParam(key: string, value: string) {
//     //     setParamsState((prev) => {
//     //         const newParams = { ...prev }
//     //         // const type = typeof paramsState[key as keyof T] as keyof StringToTypeMap;
//     //         // @ts-ignore
//     //         newParams[key] = value
//     //         // switch (type) {
//     //         //     case 'number':
//     //         //         paramsState[key as keyof T] = parseFloat(value) as any;
//     //         //         break;
//     //         //     case 'boolean':
//     //         //         paramsState[key as keyof T] = value === 'true' as any;
//     //         //         break;
//     //         //     default:
//     //         //         paramsState[key as keyof T] = value as any;
//     //         //         break;
//     //         // }

//     //         return newParams
//     //     })
//     // }
//     function toString() {
//         return Object.entries(paramsState)
//             .map(([key, value]) => `${key}=${value}`)
//             .join("&")
//     }

//     useEffect(() => {
//         router.replace(pathname + "?" + toString())
//     }, [paramsState])


//     useEffect(() => {
//         // const res = parseParams<T>(currParams)
//         // console.log('prams res', res)
//         setParamsState(parseParams<T>(currParams))
//     }, [currParams])

//     return {
//         params: paramsState,
//         setParams: setParamsState,
//         toString
//     }
// }
