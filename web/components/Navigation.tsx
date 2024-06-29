import { ProximaSoft } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { BsGithub } from 'react-icons/bs';
import LoginUserClient from "./LoginUserClient";
import Search from "./Search";
import { ModeToggle } from "./ui/ModeToggle";
import { Button } from "./ui/button";

export default async function Navigation() {
    const user = await getServerSession()

    return (
        <nav id="main-nav" className="w-full flex items-center justify-center sticky transition-all py-4 border-b-[1px] top-0 z-10 shadow-sm backdrop-blur-[8px] bg-white/70 dark:bg-zinc-950/70 overflow-hidden">
            <div className="max-w-screen-lg flex items-baseline justify-between w-full px-4 lg:px-0">
                <div className="sm:flex items-center justify-center">
                    <Link href={'/'} className={cn(ProximaSoft.className, "font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-[rgba(67,_56,_202,_1)]")}>Strapup</Link>
                </div>
                <div className="flex items-center sm:justify-end gap-0 flex-1 sm:flex-row flex-row-reverse">
                    <Search />
                    <Link href={'/docs'} className="font-medium flex items-center justify-center text-sm">
                        <Button variant={'ghost'}>
                            <p>Docs</p>
                        </Button>
                    </Link>
                    {user ? (
                        <Link href={user ? "/user/templates" : '/api/auth/signin'}>
                            <Button variant={"ghost"} className="flex gap-2 items-center justify-center">
                                <p>Profile</p>
                                <BsGithub className="text-[1rem] hidden sm:block" />
                            </Button>
                        </Link>
                    ) : (
                        <LoginUserClient className="flex gap-2 items-center justify-center" variant={'ghost'} />
                    )}
                    <ModeToggle className="hidden sm:block" />
                </div>
            </div>
        </nav >
    )
}
