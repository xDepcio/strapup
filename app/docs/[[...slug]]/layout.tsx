import DocsSideNav from "@/components/DocsSideNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[20%_80%] gap-4 px-10 max-w-screen-lg mx-auto mt-24">
            <DocsSideNav />
            {children}
        </div>
    )
}
