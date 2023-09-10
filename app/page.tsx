import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default async function Home() {
    return (
        <main className="min-h-screen flex items-center flex-col h-[200vh]">
            <section className="w-full flex justify-center h-64 mt-20">
                <div>
                    <p>Stop wasting time setting up your projects, <span>use Strapup</span></p>
                </div>
            </section>
            <section className="relative top-7 bg-zinc-50 shadow-sm border-[1px] rounded-lg py-4 px-5 w-[400px]">
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
