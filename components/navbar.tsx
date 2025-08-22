"use client"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar"
import { Button } from "./ui/button"
import * as React from "react"
import { Input } from "./ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { LogOutIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

export function Navbar({ setSearch, setShowForm, unsave, handleSave, handleSync }: { 
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    setShowForm: React.Dispatch<React.SetStateAction<{
        [key: number | string]: {
            form: boolean;
            edit?: boolean;
        };
    } | undefined>>,
    unsave?: boolean,
    handleSave: () => void,
    handleSync: () => void
}) {
    const session = useSession()

    return (
        <AlertDialog>
            <div className="bg-background px-2 h-11 fixed flex items-center justify-between top-0 pt-0 w-screen">
                <Menubar className="bg-background">
                    <MenubarMenu>
                        <MenubarTrigger onClick={() => handleSave()} className={ unsave || unsave ? "bg-red-500" : ""}>{ unsave || unsave ? "Save" : "Saved" }</MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={() => setShowForm({ "add": { form: true } })}>New</MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Profiles</MenubarTrigger>
                        <MenubarContent>
                            <AlertDialogTrigger asChild>
                                <MenubarItem><LogOutIcon /> Logout</MenubarItem>
                            </AlertDialogTrigger>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={() => handleSync()}>Sync</MenubarTrigger>
                    </MenubarMenu>
                </Menubar>
                <div>
                    <Input
                        placeholder="Search title..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        After logging out, you’ll need to sign in again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}