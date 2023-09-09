import { prisma } from "@/lib/prisma"

export default async function Home() {
    const stats = await prisma.strapupStats.findFirst({
        where: {
            id: 1
        }
    })

    return (
        <main className="min-h-screen">
            <p>Templates saved: {stats?.templatesSaved}</p>
            <p>Templates pasted: {stats?.templatesPasted}</p>
            <p>Scripts ran: {stats?.scriptsRun}</p>
        </main>
    )
}
