import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { FaEyeSlash } from "react-icons/fa";

interface Props extends HTMLAttributes<HTMLDivElement> {
}
export default function Empty({ children, ...restProps }: Props) {
    return (
        <div {...restProps} className={cn("text-muted-foreground flex items-center justify-center flex-col gap-4 mt-12", restProps.className)}>
            {children}
            <FaEyeSlash className="w-48 h-48 opacity-50" />
        </div>
    )
}
