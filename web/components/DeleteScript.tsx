'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { FaTrash } from "react-icons/fa"
import { useSession } from "next-auth/react"
import { DbScript, DbTemplte } from "@/db/types"
import { Skeleton } from "./ui/skeleton"

async function handleDeleteScript(userId: number, scriptId: number) {
    const res = await fetch(`/api/user/${userId}/scripts/${scriptId}`, {
        method: 'DELETE'
    })
    console.log(res)
    window.location.reload()
}

export default function DeleteScript({ script }: { script: DbScript }) {
    const ses = useSession()
    // if (!ses.data) return <Skeleton />

    console.log(ses)
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className="gap-2 text-red-700 h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <p>Delete</p>
                    <FaTrash />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone, It will permanently delete your data from our server and may break any dependent script using it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteScript(ses.data?.user.id!, script.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
