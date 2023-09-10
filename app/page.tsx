import { Button } from "@/components/ui/button";
import { ProximaSoft, robotoMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import Image from "next/image";

export default async function Home() {
    return (
        <main className="min-h-screen flex items-center flex-col h-[200vh] overflow-hidden">
            <section className="w-full flex justify-start h-64 mt-32 flex-col items-center relative">
                <h1 id="header-main" className={cn("", "text-5xl font-semibold tracking-tight text-center")}>Stop wasting time setting up your projects, <span className="block text-center"><span>use</span> <span className={cn(ProximaSoft.className, "text-6xl text-indigo-600 font-bold")}>Strapup</span></span>
                </h1>
                <p className={cn(robotoMono.className, "mt-6 font-medium bg-zinc-800 text-zinc-100 py-2 px-2 shadow-lg rounded-sm")}><span className="dark:bg-green-500">$</span> customizable template-cli<span className="bg-zinc-100">.</span></p>
                <div id="bg-geo" className="">
                    <div id="innger-bg-geo"></div>
                </div>
                {/* <div id="bg-geo" className={`absolute w-[1920px] h-[1080px] -z-[1] bg-[url("http://localhost:3000/hero-geo.svg")]`}>
                    <div id="innger-bg-geo" className="bg-[radial-gradient(circle,_rgba(255,_255,_255,_0)_0%,_rgba(255,_255,_255,_1)_100%),_linear-gradient(180deg,_rgba(255,_255,_255,_1)_0%,_rgba(0,_212,_255,_0)_100%)] z-20 w-[1920px] h-[1080px] absolute object-scale-down"></div>
                </div> */}
            </section>
            <section className="relative top-7 bg-zinc-800 text-zinc-100 shadow-xl rounded-lg w-[400px]">
                <div className=" flex items-center justify-between">
                    <p className="text-xl py-4 px-5">$ npx strapup</p>
                    {/* <div className="flex items-center justify-center"> */}
                    <Copy className="hover:bg-zinc-700 cursor-pointer p-3 mr-2 rounded-lg box-content" />
                    {/* </div> */}
                </div>
            </section>
            <section className="bg-indigo-800 w-full h-[600px] flex items-center justify-center">
                <div className="max-w-screen-xl grid grid-cols-2 justify-items-center items-center">
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10 font-medium">
                            Its dead simple
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed text-lg">
                            Save, paste templates and run custom scripts, all from within interactive CLI. No more copy pasting from previous projects.
                        </p>
                    </div>
                    <Image alt="" src="/paste.gif" className="rounded-xl shadow-lg" width={700} height={350} />
                    {/* <div className="bg-zinc-900 w-[700px] h-[350px] rounded-xl border-zinc-700 border-[1px]">
                    </div> */}
                </div>
            </section>
        </main>
    )
}
