'use client'

import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { Button } from "./ui/button"
import { FaEye, FaLock, FaRegEye } from "react-icons/fa"
import { HTMLAttributes, useState } from "react"
import { useSession } from "next-auth/react"
import { DbScript, DbTemplte } from "@/db/types"
import { useMutation } from "@tanstack/react-query"
import { Skeleton } from "./ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface ChangeVisibilityProps extends HTMLAttributes<HTMLDivElement> {
    changeWhat: 'script' | 'template'
    toPublic: boolean
    script?: DbScript
    template?: DbTemplte
}
export default function ChangeVisibilityBtn({ changeWhat, toPublic, script, template, ...restProps }: ChangeVisibilityProps) {
    const session = useSession()
    const [isPublic, setIsPublic] = useState(!toPublic)

    const changeTemplateVisibilityMutation = useMutation({
        mutationKey: ['change-template-visibility', template?.id],
        mutationFn: () => {
            return fetch(`/api/user/${session.data?.user.id}/templates/${template?.id}/change-visibility`, {
                method: 'POST',
                body: JSON.stringify({
                    toPublic: toPublic,
                })
            })
        },
        onSuccess: () => {
            setIsPublic(!isPublic)
        }
    })
    const changeScriptVisibilityMutation = useMutation({
        mutationKey: ['change-script-visibility', script?.id],
        mutationFn: () => {
            return fetch(`/api/user/${session.data?.user.id}/scripts/${script?.id}/change-visibility`, {
                method: 'POST',
                body: JSON.stringify({
                    toPublic: toPublic,
                })
            })
        },
        onSuccess: () => {
            setIsPublic(!isPublic)
        }
    })

    function handleChangeVisibility(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        console.log('change visibility')
        console.log('sesss', session)
        // return

        if (changeWhat === 'script') {
            console.log('change script visibility')
            changeScriptVisibilityMutation.mutate()
        }
        else if (changeWhat === 'template') {
            console.log('change template visibility')
            changeTemplateVisibilityMutation.mutate()
        }
    }

    return (
        <div className="flex items-center gap-2 px-4 py-2 mb-4">
            {(changeTemplateVisibilityMutation.isPending || changeScriptVisibilityMutation.isPending) ? (
                <Skeleton className="w-16 h-8" />
            ) : (
                <>
                    <p>{isPublic ? "Public" : "Private"}</p>
                    {isPublic ? <FaEye /> : <FaLock />}
                </>
            )}
            <Popover>
                <PopoverTrigger>
                    <div className="dark:bg-zinc-900 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        <HiOutlineDotsHorizontal className='scale-150' />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" align="center" side="top">
                    <Button
                        disabled={changeScriptVisibilityMutation.isPending || changeTemplateVisibilityMutation.isPending}
                        onClick={handleChangeVisibility}
                        variant={'ghost'}
                        className="gap-2"
                    >
                        <p>{isPublic ? "Make Private" : "Make Public"}</p>
                        {isPublic ? <FaLock /> : <FaRegEye />}
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}
