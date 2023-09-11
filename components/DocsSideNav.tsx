import { allDocs } from "@/.contentlayer/generated";
import Link from "next/link";

function recursiveBuildJSXFromPath(innerPath: string, fullPath: string) {
    if (innerPath.split('/').length === 1) {
        return <Link href={`/docs/${fullPath}`}>{innerPath}</Link>
    }
    return (
        <div>
            <p>{innerPath.split('/')[0]}</p>
            {recursiveBuildJSXFromPath(
                innerPath.split('/').slice(1).join('/'),
                fullPath
            )}
        </div>
    )
}

export default function DocsSideNav() {
    const allDocsRest = allDocs.map((doc) => ({ ...doc, body: undefined }))
    // console.log("DDDD", allDocsRest)
    return (
        <>
            {allDocsRest.map((doc) => {
                return recursiveBuildJSXFromPath(doc._raw.flattenedPath, doc._raw.flattenedPath)
            })}
        </>
        // <div>
        //     <Link href={'/docs/instalation'}>Instalation</Link>
        // </div>
    )
}
