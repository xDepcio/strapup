'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaCode, FaStar } from "react-icons/fa";
import { MdOutlineSdStorage, MdStorage } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Logout from "@/components/Logut";
import Link from "next/link";
import { FaRegStar } from "react-icons/fa6";

export default function UserPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen mx-auto max-w-screen-lg grid grid-cols-[20%_auto] mt-16 mb-16">
            <div className="flex flex-col gap-2 text-muted-foreground">
                <Link href={'/user/templates'} className={cn("py-2 flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/templates' ? 'text-indigo-600 font-medium' : '')}>
                    <p>My Templates</p>
                    <MdOutlineSdStorage />
                </Link>
                <Link href={'/user/scripts'} className={cn("py-2 flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/scripts' ? 'text-indigo-600 font-medium' : '')}>
                    <p>My Scripts</p>
                    <FaCode />
                </Link>
                <Link href={'/user/starred-templates'} className={cn("py-2 flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/starred-templates' ? 'text-indigo-600 font-medium' : '')}>
                    <FaRegStar />
                    <p>Starred Templates</p>
                    <MdOutlineSdStorage />
                </Link>
                <Link href={'/user/starred-scripts'} className={cn("py-2 flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/starred-scripts' ? 'text-indigo-600 font-medium' : '')}>
                    <FaRegStar />
                    <p>Starred Scripts</p>
                    <FaCode />
                </Link>
                <Logout className="py-2 flex gap-2 items-center cursor-pointer hover:text-red-500 transition-all">
                    <p>Logout</p>
                    <FaSignOutAlt />
                </Logout>
            </div>
            {children}
        </div>
    )
}
