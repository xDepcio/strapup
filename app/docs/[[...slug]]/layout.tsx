import DocsSideNav from "@/components/DocsSideNav";
import PageContentNav from "@/components/PageContentNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[20%_auto_20%] gap-10 px-10 max-w-screen-xl mx-auto mt-10 relative">
            <DocsSideNav />
            {children}
            <PageContentNav />
        </div>
    )
}
