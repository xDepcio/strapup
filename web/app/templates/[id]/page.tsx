import { allDocs } from '@/.contentlayer/generated'
import PageContentNav from '@/components/PageContentNav'
import StarTemplate from '@/components/StarTemplate'
import { Mdx } from '@/components/mdx-components'
import { DBQuery } from '@/db/db'
import { DbTemplte, DbUser } from '@/db/types'
import { escapeName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { FaStar } from "react-icons/fa"
import { FaCode } from "react-icons/fa6"
import { MdOutlineStorage } from "react-icons/md"
import '../../../styles/docs.css'

function getTemplateDoc(name: string) {
    return allDocs.find((doc) => doc.slugAsParams === escapeName(name))
}

export default async function TemplatePage({ params }: { params: { id: string } }) {
    const { rows, rowCount } = await DBQuery<Pick<DbTemplte, "name" | "tags" | "stars" | 'id'> & Pick<DbUser, "image" | "login" | "github_id">>(`
        SELECT t.id, t.name, t.tags, u.login, u.image, u.github_id, COUNT(uts.template_id) AS stars FROM templates t
        JOIN users u ON t.owner_id = u.id
        LEFT JOIN user_template_stars uts ON uts.template_id = t.id
        WHERE t.id = $1 AND (t.public IS TRUE OR t.owner_id = u.id)
        GROUP BY uts.template_id, t.id, u.id
    `, [params.id])

    if (rowCount === 0) {
        return <div>404</div>
        // return redirect('/')
    }

    const template = rows[0]
    const templateDoc = getTemplateDoc(template.name)
    if (!templateDoc) {
        return <div>404</div>
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-screen-xl mx-auto grid grid-cols-[1fr_3fr_1fr] gap-10'>
                <div className='mt-9'>
                    <div className='flex gap-1 flex-wrap'>
                        <p className=''>This template has earned</p>
                        <p className='text-yellow-500 text-nowrap flex items-center gap-1 font-medium'>{template.stars}<FaStar className="inline text-yellow-500" /></p>
                        <p className=''>stars</p>
                    </div>
                    <Suspense fallback={<div>loading...</div>}>
                        <StarTemplate className='flex items-center gap-1 underline' template={template} />
                    </Suspense>
                    <p className='mb-2 text-muted-foreground mt-8 text-xs'>creator</p>
                    <div className='flex items-center gap-4'>
                        <Image alt='user avatar' src={template.image} width={32} height={32} className='rounded-full shadow-md' />
                        <p className='font-medium text-sm'>{"@" + template.login}</p>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs mt-3'>
                        <FaCode />
                        <p>{36} created scripts</p>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs mt-2'>
                        <MdOutlineStorage />
                        <p>{12} created templates</p>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs mt-2'>
                        <FaStar />
                        <p>{1889} stars earned</p>
                    </div>
                    <p className='text-muted-foreground text-xs mt-8'>related tags</p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                        {template.tags?.split(' ').map((tag) => (
                            <Link href={{ pathname: '/search', query: { keyword: tag, searchTemplates: true, searchScripts: false } }} className='bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-800 dark:hover:bg-indigo-700 transition-all shadow-sm text-white rounded-md px-2 py-1 text-xs cursor-pointer'>{tag}</Link>
                        ))}
                    </div>
                </div>
                <div className=''>
                    <Mdx code={templateDoc.body.code} />
                </div>
                <PageContentNav />
            </div>
        </div>
    )
}
