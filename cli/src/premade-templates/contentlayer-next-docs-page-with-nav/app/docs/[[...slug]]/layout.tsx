import DocsSideNav from "@/components/DocsSideNav";
import PageContentNav from "@/components/PageContentNav";
import '../../../styles/docs.css'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[1fr_3fr_1fr] max-w-screen-xl mx-auto mt-10 relative mb-32">
            <DocsSideNav />
            {children}
            <PageContentNav />
        </div>
    )
}
