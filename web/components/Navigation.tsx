import { ProximaSoft } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BsGithub } from 'react-icons/bs';
import { ModeToggle } from "./ui/ModeToggle";
import { Button } from "./ui/button";

export default function Navigation() {

    return (
        <nav id="main-nav" className="w-full flex items-center justify-center sticky transition-all py-4 border-b-[1px] top-0 z-10 shadow-sm backdrop-blur-[8px] bg-white/70 dark:bg-zinc-950/70">
            <div className="max-w-screen-lg flex items-center justify-between w-full px-4 lg:px-0">
                <div className="flex items-center justify-center">
                    <Link href={'/'} className={cn(ProximaSoft.className, "font-bold text-2xl bg-clip-text text-transparent bg-[rgba(67,_56,_202,_1)]")}>Strapup</Link>
                </div>
                <div className="flex items-center justify-center gap-8">
                    <div className="font-medium flex items-center justify-center">
                        <Link href={'/docs'}>Docs</Link>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button variant={"ghost"} className="flex items-center justify-center">
                            <Link href={"https://github.com/xDepcio/strapup-mono"}>
                                <BsGithub className="text-[1rem]" />
                            </Link>
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}
