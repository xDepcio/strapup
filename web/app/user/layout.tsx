'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaCode } from "react-icons/fa";
import { MdOutlineSdStorage, MdStorage } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Logout from "@/components/Logut";
import Link from "next/link";

export default function UserPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen mx-auto max-w-screen-lg grid grid-cols-[20%_auto] mt-16 mb-16">
            <div className="flex flex-col gap-4 text-muted-foreground">
                <Link href={'/user/templates'} className={cn("flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/templates' ? 'text-indigo-600 font-medium' : '')}>
                    <p>My Templates</p>
                    <MdOutlineSdStorage />
                </Link>
                <Link href={'/user/scripts'} className={cn("flex gap-2 items-center cursor-pointer hover:text-indigo-600 transition-all", pathname === '/user/scripts' ? 'text-indigo-600 font-medium' : '')}>
                    <p>My Scripts</p>
                    <FaCode />
                </Link>
                {/* <div className={"flex gap-2 items-center cursor-pointer hover:text-red-500 transition-all"}> */}
                <Logout className="flex gap-2 items-center cursor-pointer hover:text-red-500 transition-all">
                    <p>Logout</p>
                    <FaSignOutAlt />
                </Logout>
                {/* </div> */}
            </div>
            {children}
        </div>
    )
}
