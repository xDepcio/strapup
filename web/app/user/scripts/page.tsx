import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import ChangeVisibilityBtn from "@/components/ChangeVisibility"
import DeleteScript from "@/components/DeleteScript"
import Empty from "@/components/Empty"
import { Button } from "@/components/ui/button"
import { DBQuery } from "@/db/db"
import { DbScript, DbTemplte } from "@/db/types"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FaCode, FaEdit, FaRegStar } from "react-icons/fa"
import { Merge } from "type-fest"

export default async function UserPage() {
    const user = await getServerSession(authOptions)
    if (!user) {
        return redirect('/')
    }

    const { rows, rowCount } = await DBQuery<Merge<Pick<DbScript, 'id' | 'name' | 'public' | 'tags' | 'description'>, { stars: number }>>(`
        SELECT
            s.id,
            s.name,
            s.description,
            s.public,
            s.owner_id,
            s.tags,
            s.synced,
            COUNT(uss.script_id) AS stars
        FROM
            scripts AS s
        LEFT JOIN
            user_script_stars AS uss ON s.id = uss.script_id
        WHERE
            s.owner_id = $1
        GROUP BY
            s.id,
            s.name,
            s.public,
            s.owner_id,
            s.tags,
            s.synced
        ORDER BY stars DESC;
    `, [user.user.id])

    if (rowCount === 0) {
        return (
            <Empty className="self-start">
                <p>{`You don't have any created scripts.`}</p>
            </Empty>
        )
    }
    const scripts = rows


    return (
        <div className="flex flex-col gap-2 h-fit dark:bg-zinc-900 bg-zinc-50 rounded-lg p-4 border">
            {scripts.map((script, i) => (
                <div key={i} className="flex border-b justify-between">
                    <div className="flex gap-4 flex-col justify-center dark:border-zinc-800 border-zinc-200 p-4">
                        <div className="flex items-center gap-2">
                            <Link href={`/scripts/${script.id}`}>
                                <h4 className="cursor-pointer hover:underline scroll-m-20 text-lg font-semibold tracking-tight">{script.name}</h4>
                            </Link>
                            <div className="w-fit bg-indigo-200 flex items-center gap-1 rounded-full px-2 py-[2px] text-xs text-indigo-800">
                                <FaCode />
                                <p>script</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-yellow-200 px-2 py-[2px] rounded-full text-yellow-800">
                                <FaRegStar />
                                <p className="">{script.stars}</p>
                            </div>
                        </div>
                        <p className="text-ellipsis overflow-hidden line-clamp-2 max-w-[60ch]">{script.description}</p>
                        <div className="flex gap-2">
                            {script.tags?.split(' ').map((tag, i) => (
                                <Link href={{ pathname: '/search', query: { keyword: tag } }} className="dark:bg-zinc-800 bg-zinc-200 px-2 py-[2px] rounded-md text-sm"
                                    key={i}>
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="text-muted-foreground text-sm items-start flex flex-col">
                        <ChangeVisibilityBtn script={script as DbScript} changeWhat="script" toPublic={!script.public} />
                        <Button disabled className="flex items-center gap-2" variant={'ghost'}>
                            <p>Edit</p>
                            <FaEdit />
                        </Button>
                        <DeleteScript script={script as DbScript} />
                    </div>
                </div>
            ))}
        </div>
    )
}
