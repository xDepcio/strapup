'use client'

import { MdOutlineNavigateNext } from 'react-icons/md'
import { RxHamburgerMenu } from 'react-icons/rx'
import PageContentNav from "./PageContentNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import DocsSideNav from './DocsSideNav'
import { AiOutlineClose } from 'react-icons/ai'
import { Doc } from '@/.contentlayer/generated'

export default function MobileDocsNav({ allDocs }: { allDocs: Doc[] }) {
    return (
        <div className="sm:hidden w-screen h-14 fixed bottom-0 dark:bg-zinc-950 bg-white border-t flex items-center justify-between text-muted-foreground font-medium z-10">
            <div className="flex items-center justify-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} className='flex items-center justify-center gap-2'>
                            <RxHamburgerMenu />
                            <p>All Docs</p>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={'left'} className='flex flex-col w-2/3 px-2 py-1 overflow-y-auto justify-between'>
                        {/* <SheetHeader>
                            <SheetTitle></SheetTitle>
                            <SheetDescription>

                            </SheetDescription>
                        </SheetHeader> */}

                        <DocsSideNav allDocs={allDocs} className='block h-full w-full mt-6' />

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit" variant={'ghost'} className='gap-2'>
                                    <AiOutlineClose />
                                    Close
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

            </div>
            <div data-open="false"
                onClick={(e) => e.currentTarget.dataset.open = e.currentTarget.dataset.open === 'false' ? 'true' : 'false'}
            >
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} className='flex items-center justify-center gap-2'>
                            <MdOutlineNavigateNext />
                            <p>Page Nav</p>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='flex flex-col w-2/3 backdrop-blur-0 px-2 py-1'>
                        <SheetHeader>
                            <SheetTitle></SheetTitle>
                            <SheetDescription>

                            </SheetDescription>
                        </SheetHeader>

                        <PageContentNav className='block h-full w-full' />

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit" variant={'ghost'} className='gap-2'>
                                    <AiOutlineClose />
                                    Close
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

            </div>
        </div>
    )
}
