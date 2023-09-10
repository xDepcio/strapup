import { Button } from "@/components/ui/button";
import { ProximaSoft, robotoMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import Image from "next/image";

export default async function Home() {
    return (
        <main className="min-h-screen flex items-center flex-col h-[200vh] overflow-hidden">
            <section className="w-full flex justify-start h-64 mt-20 flex-col items-center relative">
                <h1 id="header-main" className={cn("", "text-5xl font-semibold tracking-tight text-center")}>Stop wasting time setting up your projects, <span className="block text-center"><span>use</span> <span className={cn(ProximaSoft.className, "text-6xl text-indigo-600 font-bold")}>Strapup</span></span>
                </h1>
                <p className={cn(robotoMono.className, "mt-6 font-medium bg-zinc-800 text-zinc-100 py-2 px-2 shadow-lg rounded-sm")}><span className="">$</span> customizable template-cli<span className="bg-zinc-100">.</span></p>
                <div id="bg-geo" className="">
                    <div id="innger-bg-geo"></div>
                    {/* <Image alt="" src={'./hero-geo.svg'} width={1920} height={200} className="absolute -bottom-[200px] -z-20" /> */}
                </div>
            </section>
            <section className="relative top-7 bg-zinc-50 shadow-xl border-[1px] rounded-lg py-4 px-5 w-[400px]">
                <div className=" flex items-center justify-between">
                    <p className="text-xl">$ npx strapup</p>
                    <div className="flex items-center justify-center">
                        <Copy />
                    </div>
                </div>
            </section>
            <section className="bg-indigo-800 w-full h-[600px] flex items-center justify-center">
                <div className="max-w-screen-xl grid grid-cols-2 justify-items-center items-center">
                    <div className="">
                        <h3 className="text-3xl text-zinc-100 mb-10">
                            Its dead simple
                        </h3>
                        <p className="max-w-[30rem] text-zinc-100 leading-relaxed">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident dolores, minus magni, facere ullam modi quia deserunt delectus error eum rem impedit exercitationem, totam quaerat. Cumque recusandae rem tempora minus.
                        </p>
                    </div>
                    <div className="bg-zinc-900 w-[700px] h-[350px] rounded-xl border-zinc-700 border-[1px]">

                    </div>
                </div>
            </section>
        </main>
    )
}
