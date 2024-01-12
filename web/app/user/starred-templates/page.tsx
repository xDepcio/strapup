import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import Empty from "@/components/Empty"
import { DBQuery } from "@/db/db"
import { DbScript } from "@/db/types"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FaCode, FaRegStar } from "react-icons/fa"
import { MdOutlineSdStorage } from "react-icons/md"
import { Merge } from "type-fest"

export default async function UserPage({ children }: { children: React.ReactNode }) {
    const user = await getServerSession(authOptions)
    if (!user) {
        return redirect('/')
    }
    console.log('user', user)

    const { rows, rowCount } = await DBQuery<Merge<Pick<DbScript, 'id' | 'name' | 'public' | 'tags' | 'owner_id'>, { stars: number }>>(`
        SELECT t.id, t.name, t.public, t.owner_id, t.tags, t.synced, COUNT(uts.template_id) AS stars
        FROM templates t
        LEFT JOIN user_template_stars uts ON t.id = uts.template_id
        WHERE uts.user_id=$1
        GROUP BY t.id, t.name
    `, [user.user.id])

    if (rowCount === 0) {
        return (
            <Empty className="self-start">
                <p>You don't have any starred templates.</p>
            </Empty>
        )
    }
    const scripts = rows

    return (
        <div className="flex flex-col gap-2 dark:bg-zinc-900 bg-zinc-50 rounded-lg p-4 border h-fit">
            {scripts.map((script) => (
                <div key={script.name} className="flex border-b justify-between">
                    <div className="flex gap-4 flex-col justify-center dark:border-zinc-800 border-zinc-200 p-4">
                        <div className="flex items-center gap-2">
                            <Link href={`/scripts/${script.id}`}>
                                <h4 className="cursor-pointer hover:underline scroll-m-20 text-lg font-semibold tracking-tight">{script.name}</h4>
                            </Link>
                            <div className="w-fit bg-indigo-200 flex items-center gap-1 rounded-full px-2 py-[2px] text-xs text-indigo-800">
                                <MdOutlineSdStorage />
                                <p>template</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-yellow-200 px-2 py-[2px] rounded-full text-yellow-800">
                                <FaRegStar />
                                <p className="">{script.stars}</p>
                            </div>
                        </div>
                        <p className="text-ellipsis overflow-hidden line-clamp-2 max-w-[60ch]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora aut non cupiditate porro in! Laborum repellendus, molestias enim voluptatibus doloribus nulla corrupti iure quod perferendis maiores? Impedit laborum in odit!</p>
                        <div className="flex gap-2">
                            {script.tags?.split(' ').map((tag, i) => (
                                <Link href={{ pathname: '/search', query: { keyword: tag } }} className="dark:bg-zinc-800 bg-zinc-200 px-2 py-[2px] rounded-md text-sm"
                                    key={i}>
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
