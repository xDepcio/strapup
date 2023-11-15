'use client'

import { useEffect, useState } from "react"

export default function NavScript() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        if (scrollY > 50) {
            const navEle = document.getElementById('main-nav')
            let className = 'py-2 border-b-[1px] border-indigo-200 shadow-sm'
            navEle?.classList.remove('py-4')
            navEle?.classList.add(...className.split(' '))
        }
        else {
            const navEle = document.getElementById('main-nav')
            let className = 'py-2 border-b-[1px] shadow-sm'
            navEle?.classList.remove(...className.split(' '))
            navEle?.classList.add('py-4')
        }
    }, [scrollY])

    useEffect(() => {
        document.addEventListener('scroll', () => {
            setScrollY(window.scrollY)
        })

        return () => {
            document.removeEventListener('scroll', () => {
                setScrollY(window.scrollY)
            })
        }
    }, [])

    return (
        <></>
    )
}
