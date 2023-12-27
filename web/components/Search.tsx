import { FaSearch } from "react-icons/fa";

export default function Search() {
    return (
        <button className="dark:bg-zinc-900 bg-zinc-100 flex text-muted-foreground text-sm items-center justify-between px-4 py-2 gap-8 rounded-md">
            <div className="flex items-center justify-center gap-2">
                <FaSearch />
                <p className="">Search templates/scripts...</p>
            </div>
            <p className="dark:bg-zinc-950 dark:border-zinc-500 dark:text-zinc-50 p-0 text-xs font-medium bg-white px-2 py-[2px] rounded-full text-zinc-950 border border-zinc-200">
                Ctrl+K
            </p>
        </button>
    )
}
