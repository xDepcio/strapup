import { Button } from "@/components/ui/button";
import { ProximaSoft, robotoMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import Image from "next/image";
import { FaNpm } from "react-icons/fa"
import { BiPaste, BiCodeAlt } from "react-icons/bi"
import { prisma } from "@/lib/prisma";
import { FiCopy } from "react-icons/fi"
import { RiSave3Line } from "react-icons/ri"

export default async function Home() {
    const stats = await prisma.strapupStats.findFirst({
        where: {
            id: 1
        }
    })

    return (
        <main className="min-h-screen flex items-center flex-col h-[200vh] overflow-hidden">
            <section className="w-full flex justify-start h-64 mt-32 flex-col items-center relative">
                <h1 id="header-main" className={cn("", "text-5xl font-semibold tracking-tight text-center")}>Stop wasting time setting up your projects, <span className="block text-center"><span>use</span> <span className={cn(ProximaSoft.className, "text-6xl text-indigo-600 font-bold")}>Strapup</span></span>
                </h1>
                <p className={cn(robotoMono.className, "mt-6 font-medium bg-zinc-800 text-zinc-100 py-2 px-2 shadow-lg rounded-sm")}><span className="dark:bg-green-500">$</span> customizable template-cli<span className="bg-zinc-100">.</span></p>
                <div id="bg-geo" className="">
                    <div id="innger-bg-geo"></div>
                </div>
            </section>
            <section className="relative top-7 bg-zinc-800 text-zinc-100 shadow-xl rounded-lg w-[400px]">
                <div className=" flex items-center justify-between">
                    <p className="text-xl py-4 px-5">$ npx strapup</p>
                    <Copy className="hover:bg-zinc-700 cursor-pointer p-3 mr-2 rounded-lg box-content" />
                </div>
            </section>
            <section className="bg-indigo-800 w-full py-20 flex items-center justify-center flex-col">
                <div className="max-w-screen-xl grid grid-cols-2 justify-items-center items-center">
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10 font-medium">
                            Start creating faster
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed text-lg">
                            Save time on repetive setups. Save and paste templates, all from within interactive CLI. No more copy pasting from previous projects.
                        </p>
                    </div>
                    <Image alt="" src="/paste-and-save.gif" className="rounded-xl shadow-lg" width={700} height={350} />
                </div>
                <div className="max-w-screen-xl grid grid-cols-2 justify-items-center items-center mt-20">
                    <Image alt="" src="/paste-and-save.gif" className="rounded-xl shadow-lg" width={700} height={350} />
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10 font-medium">
                            Improve your workflow
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed text-lg">
                            Go beyond tools like <span className={cn(robotoMono.className)}>npx create-next-app</span> by creating custom scripts, which can setup your whole custom project in one go.
                        </p>
                    </div>
                </div>
            </section>
            <section className="mt-16 relative w-full">
                <div>
                    <h3 className="text-center mb-12 text-3xl font-medium relative w-fit mx-auto">Community stats 🎉</h3>
                </div>
                <div className="flex gap-12 items-stretch justify-center">
                    <div className="flex items-center justify-center p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">templates saved</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{stats?.templatesSaved || '917'}</p>
                        <RiSave3Line className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col  ">
                        <p className="text-lg font-medium">templates paste</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{stats?.templatesPasted || '1233'}</p>
                        <FiCopy className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">scripts ran</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{stats?.scriptsRun || '122'}</p>
                        <BiCodeAlt className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">package downloads</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >1514</p>
                        <FaNpm className="text-5xl flex-grow" />
                    </div>
                </div>
                <div id="bg-geo-2" className="">
                    <div id="innger-bg-geo-2"></div>
                </div>
            </section>
        </main>
    )
}
