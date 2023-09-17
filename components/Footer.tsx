import Link from "next/link";
import { FaGithub, FaNpm } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="border-t-[1px] flex items-center justify-center gap-14 p-4 text-muted-foreground pb-4">
            <p>Created by <Link href={'https://github.com/xDepcio'} className="text-foreground underline">xDepcio</Link>, source code avalible on <Link href={'https://github.com/xDepcio/strapup'} className="text-foreground underline">Github</Link>.</p>
        </footer>
    )
}
