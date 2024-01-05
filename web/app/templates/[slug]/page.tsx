import { DBQuery } from '@/db/db'
import { DbTemplte } from '@/db/types'
import { unescapeName } from '@/lib/utils'
import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'

export default async function TemplatePage({ params }: { params: { slug: string } }) {
    const templateName = decodeURIComponent(unescapeName(params.slug))
    console.log(templateName)
    const { rows, rowCount } = await DBQuery<DbTemplte>('SELECT name, tags, stars FROM templates WHERE name = $1 AND public IS TRUE', [templateName])

    console.log(rows, rowCount)

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
