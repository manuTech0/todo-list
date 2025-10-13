"use client"
import * as React from "react"
import { CloudCogIcon, CloudUpload, LogOutIcon, Moon, RecycleIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import { toast } from "sonner"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function Navbar({
    saveData,
    syncData

}: { 
    saveData?: () => Promise<void>
    syncData?: () => Promise<void>
}) {
    const {theme, setTheme} = useTheme()
    const { isAuth, user } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    const logout = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.manu-tech.my.id"
        const url = apiUrl + "/auth/logout"
        toast.promise(axios.post(url, {}, {
            withCredentials: true
        }), {
            loading: "Logout...",
            error: (e) => {
                console.log(e)
                return "Failed Logout"
            },
            success: (res: AxiosResponse) => {
                if(res.data.logout) {
                    localStorage.removeItem("unsave")
                    setTimeout(() => {
                        router.push("/")
                    }, 300);
                    return "Success logout"
                }
            }
        })
    }

    return (
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    TD
                </div>
                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Todo App
                </span>
            </div>

            <div className="flex justify-end gap-4">
                {pathname != "/" && syncData && saveData && isAuth && (
                    <div className="flex gap-4">
                        <Tooltip>
                            <TooltipTrigger>
                                <button
                                    onClick={() => syncData()}
                                    aria-label="Sync Data"
                                    className="p-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <CloudCogIcon size={18}/>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Sync Data
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <button
                                    onClick={() => saveData()}
                                    aria-label="Save Data"
                                    className="p-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <CloudUpload size={18}/>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Save To Cloud
                            </TooltipContent>
                        </Tooltip>
                        
                    </div>
                )}
                <Tooltip>
                    <TooltipTrigger>
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label="Toggle theme"
                            className="p-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Change theme
                    </TooltipContent>
                </Tooltip>
                {isAuth && (
                    <Tooltip>
                        <TooltipTrigger>
                            <button
                                onClick={() => logout()}
                                aria-label="Save Data"
                                className="p-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <LogOutIcon size={18}/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </nav>
    )
}