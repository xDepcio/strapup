import { allDocs } from '@/.contentlayer/generated'
import PageContentNav from '@/components/PageContentNav'
import StarIt from '@/components/StarTemplate'
import { Mdx } from '@/components/mdx-components'
import { DBQuery } from '@/db/db'
import { DbTemplte, DbUser } from '@/db/types'
import { escapeName, unescapeName } from '@/lib/utils'
import Image from 'next/image'
import { FaStar } from "react-icons/fa"
import { FaCode } from "react-icons/fa6"
import { MdOutlineStorage } from "react-icons/md"
import '../../../styles/docs.css'

function getTemplateDoc(name: string) {
    return allDocs.find((doc) => doc.slugAsParams === escapeName(name))
}

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

    const template = getTemplateDoc(templateName)
    if (!template) {
        return <div>404</div>
    }

    return (
        <div className=''>
            <div className='max-w-screen-xl mx-auto grid grid-cols-[1fr_3fr_1fr] gap-10'>
                <div className='mt-9'>
                    <div className='flex gap-1 flex-wrap'>
                        <p className=''>This template has earned</p>
                        <p className='text-yellow-500 text-nowrap flex items-center gap-1 font-medium'>122 <FaStar className="inline text-yellow-500" /></p>
                        <p className=''>stars</p>
                        <StarIt className='' />
                        {/* <p className='text-muted-foreground'>This template has earned <span className='relative text-yellow-500 text-nowrap'>122 <FaStar className="inline text-yellow-500" /></span> stars</p> */}
                    </div>
                    <p className='mb-2 text-muted-foreground mt-8 text-xs'>creator</p>
                    <div className='flex items-center gap-4'>
                        <Image alt='user avatar' src={rows[0].image} width={32} height={32} className='rounded-full shadow-md' />
                        <p className='font-medium text-sm'>{"@" + rows[0].login}</p>
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
                        {rows[0].tags.split(' ').map((tag) => (
                            <div className='bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-800 dark:hover:bg-indigo-700 transition-all shadow-sm text-white rounded-md px-2 py-1 text-xs cursor-pointer'>{tag}</div>
                        ))}
                    </div>
                </div>
                <div className=''>
                    <Mdx code={template.body.code} />
                </div>
                <PageContentNav />
            </div>
        </div>
    )
}
