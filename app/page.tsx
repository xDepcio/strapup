import { prisma } from "@/lib/prisma"

export default async function Home() {
    const stats = await prisma.strapupStats.findFirst({
        where: {
            id: 1
        }
    })

    return (
        <main className="min-h-screen flex justify-center h-[200vh]">
            <section className="w-full flex justify-center">
                <div>
                    <p>Stop wasting time setting up your projects, <span>use Strapup</span></p>
                </div>
            </section>
        </main>
    )
}
