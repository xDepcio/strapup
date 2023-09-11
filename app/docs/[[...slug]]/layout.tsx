import DocsSideNav from "@/components/DocsSideNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[20%_80%] gap-4 px-10 max-w-screen-xl mx-auto">
            <DocsSideNav />
            {children}
        </div>
    )
}
