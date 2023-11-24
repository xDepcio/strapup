import Link from "next/link";
import { FaGithub, FaNpm } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="border-t-[1px] sm:flex items-center justify-center gap-14 p-4 text-muted-foreground pb-4 hidden">
            <p>Source code avalible on <Link href={'https://github.com/xDepcio/strapup-mono'} className="text-foreground underline">Github</Link>.</p>
        </footer>
    )
}
