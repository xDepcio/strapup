import DocsSideNav from "@/components/DocsSideNav";
import PageContentNav from "@/components/PageContentNav";
import '../../../styles/docs.css'
import MobileDocsNav from "@/components/MobileDocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex max-w-screen-xl mx-auto mt-10 relative mb-32">
            <DocsSideNav />
            {children}
            <PageContentNav />
            <MobileDocsNav />
        </div>
    )
}
