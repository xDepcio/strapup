import { auth } from "@/auth";
import CopyBtnMain from "@/components/CopyBtnMain";
import { Button } from "@/components/ui/button";
import { ProximaSoft, robotoMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BiCodeAlt } from "react-icons/bi";
import { FaNpm } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { RiSave3Line } from "react-icons/ri";

export const metadata: Metadata = {
    title: 'Strapup',
    description: 'Stop wasting time setting up your projects, use Strapup',
}

export default async function Home() {
    const u = await auth()
    console.log('us main', u)
    return (
        <main className="min-h-screen flex items-center flex-col overflow-hidden">
            <section className="w-full flex justify-start h-64 sm:mt-32 flex-col items-center relative mt-16 mb-12 sm:mb-0">
                <h1 id="header-main" className={cn("", "text-5xl font-semibold tracking-tight text-center")}>Stop wasting time setting up your projects, <span className="block text-center"><span>use</span> <span className={cn(ProximaSoft.className, "text-6xl text-indigo-600 font-bold")}>Strapup</span></span>
                </h1>
                <p className={cn(robotoMono.className, "mt-6 font-medium bg-zinc-800 text-zinc-100 py-2 px-2 shadow-lg rounded-sm")}><span className="">$</span> customizable template-cli<span className="bg-zinc-100">.</span></p>
                <div className="bg-geo" style={{ backgroundImage: `url(/hero-geo.svg)` }}>
                    <div className="innger-bg-geo dark:[background:_radial-gradient(circle,_rgba(9,_9,_11,_0)_0%,_rgba(9,_9,_11,_1)_100%),_linear-gradient(180deg,_rgba(9,_9,_11,_1)_0%,_rgba(9,_9,_11,_0)_100%);]"></div>
                </div>
            </section>
            <section className="box-content max-w-[400px] w-full flex items-center justify-center" >
                <div className="relative top-7 bg-zinc-800 text-zinc-100 shadow-xl rounded-lg max-w-[400px] sm:w-full w-[90%]">
                    <div className=" flex items-center justify-between">
                        <p className="text-xl py-4 px-5">$ npx strapup</p>
                        <CopyBtnMain />
                    </div>
                </div>
            </section>
            <section className="bg-indigo-800 w-full py-20 flex items-center justify-center flex-col">
                <div className="max-w-screen-xl sm:grid sm:grid-cols-2 sm:justify-items-center sm:items-center flex flex-col px-4 gap-4 sm:px-0 sm:gap-0">
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10 font-medium">
                            Start creating faster
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed text-lg">
                            Save time on repetive setups. Save and paste templates, all from within interactive CLI. No more copy pasting from previous projects.
                        </p>
                        <div className="w-full flex items-center justify-start mt-4">
                            <Button variant={'ghost'} className="text-zinc-100 self-end  underline-offset-4 hover:bg-indigo-600 hover:text-zinc-100 transition-all text-lg bg-indigo-700 shadow-md">
                                <Link href={'/docs/Basic use/Save and Paste'} className="flex items-center justify-center gap-1">
                                    <p>read more</p>
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <Image alt="" src="/paste-and-save.gif" className="rounded-xl shadow-lg" width={700} height={350} />
                </div>
                <div className="max-w-screen-xl sm:grid sm:grid-cols-2 sm:justify-items-center sm:items-center flex flex-col-reverse px-4 gap-4 sm:px-0 sm:gap-0 mt-20">
                    <Image alt="" src="/running-scripts.gif" className="rounded-xl shadow-lg" width={700} height={350} />
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10 font-medium">
                            Improve your workflow
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed text-lg">
                            Go beyond tools like <span className={cn(robotoMono.className)}>npx create-next-app</span> by creating custom scripts, which can setup your whole custom project in one go.
                        </p>
                        <div className="w-full flex items-center justify-start mt-4">
                            <Button variant={'ghost'} className="text-zinc-100 self-end  underline-offset-4 hover:bg-indigo-600 hover:text-zinc-100 transition-all text-lg bg-indigo-700 shadow-md">
                                <Link href={'/docs/Basic use/Scripts'} className="flex items-center justify-center gap-1">
                                    <p>read more</p>
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-16 relative w-full mb-12">
                <div>
                    <h3 className="text-center mb-12 text-3xl font-medium relative w-fit mx-auto">Community stats 🎉</h3>
                </div>
                <div className="flex gap-12 items-stretch justify-center flex-wrap sm:flex-nowrap">
                    <div className="flex items-center justify-center p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">templates saved</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{"??" || '917'}</p>
                        <RiSave3Line className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col  ">
                        <p className="text-lg font-medium">templates paste</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{"??" || '1233'}</p>
                        <FiCopy className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">scripts ran</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >{"??" || '122'}</p>
                        <BiCodeAlt className="text-3xl flex-grow" />
                    </div>
                    <div className="flex items-center justify-center  p-2 rounded-lg flex-col">
                        <p className="text-lg font-medium">package downloads</p>
                        <p className={cn("text-4xl font-bold text-indigo-600", ProximaSoft.className)} >1514</p>
                        <FaNpm className="text-5xl flex-grow" />
                    </div>
                </div>
                <div className="bg-geo-2" style={{ backgroundImage: `url(/hero-geo.svg)` }}>
                    <div className="innger-bg-geo-2 dark:[background:_radial-gradient(circle,_rgba(9,_9,_11,_0)_0%,_rgba(9,_9,_11,_1)_100%),_linear-gradient(0deg,_rgba(9,_9,_11,_1)_0%,_rgba(0,_212,_255,_0)_100%),_linear-gradient(0deg,_rgba(9,_9,_11,_0.281)_0%,_rgb(9,_9,_11)_100%);]"></div>
                </div>
            </section>
        </main>
    )
}
