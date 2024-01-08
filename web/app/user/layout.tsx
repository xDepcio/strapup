'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaCode } from "react-icons/fa";
import { MdOutlineSdStorage, MdStorage } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Logout from "@/components/Logut";

export default function UserPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen mx-auto max-w-screen-lg grid grid-cols-[20%_auto] mt-16 mb-16">
            <div className="flex flex-col gap-4 text-muted-foreground">
                <div className={cn("flex gap-2 items-center cursor-pointer hover:text-foreground transition-all", pathname === '/user/templates' ? 'text-foreground' : '')}>
                    <p>My Templates</p>
                    <MdOutlineSdStorage />
                </div>
                <div className={cn("flex gap-2 items-center cursor-pointer hover:text-foreground transition-all", pathname === '/user/scripts' ? 'text-foreground' : '')}>
                    <p>My Scripts</p>
                    <FaCode />
                </div>
                <div className={"flex gap-2 items-center cursor-pointer hover:text-foreground transition-all"}>
                    <Logout className="flex gap-2 items-center cursor-pointer hover:text-foreground transition-all">
                        <p>Logout</p>
                        <FaSignOutAlt />
                    </Logout>
                </div>
            </div>
            {children}
        </div>
    )
}
