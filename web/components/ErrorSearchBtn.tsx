'use client'

import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";

export default function ErrorSearchBtn() {


    return (
        <Button onClick={() => {
            const trigger = document.getElementById('search-trigger')
            trigger?.click()
        }} className="gap-2 bg-indigo-700 text-zinc-100 hover:bg-indigo-600">
            <FaSearch />
            <p>Search</p>
        </Button>
    )
}
