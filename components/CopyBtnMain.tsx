'use client'

import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyBtnMain() {

    return (
        <Copy onClick={() => toast.success("Copied! 📝")} className="hover:bg-zinc-700 cursor-pointer p-3 mr-2 rounded-lg box-content" />
    )
}
