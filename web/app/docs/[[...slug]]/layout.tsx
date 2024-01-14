import DocsSideNav from "@/components/DocsSideNav";
import PageContentNav from "@/components/PageContentNav";
import '../../../styles/docs.css'
import MobileDocsNav from "@/components/MobileDocsNav";
import { allDocs } from "@/.contentlayer/generated";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const staticDocs = allDocs.filter((doc) => doc._raw.sourceFileDir !== 'remote-scripts' && doc._raw.sourceFileDir !== 'remote-templates')

    return (
        <div className="flex max-w-screen-xl mx-auto mt-10 relative mb-32">
            <DocsSideNav allDocs={staticDocs} />
            {children}
            <PageContentNav />
            <MobileDocsNav allDocs={staticDocs} />
        </div>
    )
}
