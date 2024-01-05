import { DBQuery } from '@/db/db'
import { DbTemplte, DbUser } from '@/db/types'
import { unescapeName } from '@/lib/utils'
import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'

export default async function TemplatePage({ params }: { params: { slug: string } }) {
    const templateName = decodeURIComponent(unescapeName(params.slug))
    console.log(templateName)
    const { rows, rowCount } = await DBQuery<Pick<DbTemplte, "name" | "tags" | "stars"> & Pick<DbUser, "image" | "login" | "github_id">>(`
        SELECT t.name, t.tags, t.stars, u.login, u.image, u.github_id FROM templates t
        JOIN users u ON t.owner_id = u.id
        WHERE t.name = $1 AND t.public IS TRUE
    `, [templateName])

    if (rowCount === 0) {
        return <div>404</div>
        // return redirect('/')
    }

    return (
        <div>
            <h1>{rows[0].name}</h1>
            <p>{rows[0].tags}</p>
            <p>{rows[0].stars}</p>
        </div>
    )
}
