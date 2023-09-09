import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postScheme = z.object({
    stat: z.literal("templateSaved").or(z.literal("templatePasted")).or(z.literal("scriptRan")),
})

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const validBody = postScheme.parse(body);

        const currentStats = await prisma.strapupStats.findFirst({
            where: {
                id: 1
            }
        })

        const updated = await prisma.strapupStats.update({
            where: {
                id: 1
            },
            data: {
                scriptsRun: validBody.stat === "scriptRan" ? currentStats!.scriptsRun + 1 : currentStats!.scriptsRun,
                templatesPasted: validBody.stat === "templatePasted" ? currentStats!.templatesPasted + 1 : currentStats!.templatesPasted,
                templatesSaved: validBody.stat === "templateSaved" ? currentStats!.templatesSaved + 1 : currentStats!.templatesSaved,
            }
        })

        return NextResponse.json({ updated: updated });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request' });
    }
}
