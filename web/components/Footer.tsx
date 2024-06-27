import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";

export default function Footer() {
    return (
        <footer className="border-t-[1px] flex items-center justify-center gap-2 px-4 text-muted-foreground py-3">
            <ModeToggle className="block sm:hidden" />
            <p>Source code avalible on <Link href={'https://github.com/xDepcio/strapup-mono'} className="text-foreground underline">Github</Link>.</p>
        </footer>
    )
}
