import Image from "next/image"
import { MdError } from "react-icons/md";
import { TbError404 } from "react-icons/tb";
import { Button } from "./ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import ErrorSearchBtn from "./ErrorSearchBtn";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full h-full min-h-[85.9vh] flex items-center justify-center flex-col text-muted-foreground">
            <p>We couldn't find the page you were looking for :(</p>
            <div className="flex gap-4 w-full items-center justify-center opacity-60">
                <MdError className="w-28 h-28" />
                <TbError404 className="w-48 h-48" />
            </div>
            <div className="flex gap-8">
                <Link href={'/'}>
                    <Button variant={'outline'} className="gap-2">
                        <IoIosArrowBack />
                        <p>Home</p>
                    </Button>
                </Link>
                <ErrorSearchBtn />
            </div>
        </div>
    );
};
