import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useSessionStorage } from "@/lib/sessionStorage";
import { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

export function LineForm({ data, setShowForm, formHandle, inputHandle }: { 
    data?: TodoItem,
    setShowForm: React.Dispatch<React.SetStateAction<{
        [key: number | string]: {
            form: boolean;
            edit?: boolean;
        };
    } | undefined>>,
    formHandle: (val: React.FormEvent<HTMLFormElement>) => void,
    inputHandle: React.Dispatch<React.SetStateAction<{
        id?: string;
        title: string;
        description: string;
    } | undefined>>
}) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if(!value) {
            toast.error(`Field ${name} is empty`)
        } else {
            inputHandle((p) => ({
                ...(data ? data : p),
                [name]: value
            } as typeof data))
        }
    }

    return (
        <li className="w-full h-16 px-2 text-2xl border-b-2 border-black flex space-start items-center">
            <form className="w-full" method="post" onSubmit={val => formHandle(val)}>
                <div className="flex justify-between w-full">
                    <input name="id" type="hidden" defaultValue={data?.id} />
                    <Input name="title" onChange={handleChange} className="shadow-sm border-none w-full focus:border-b placeholder:text-foreground" placeholder="Insert title..." defaultValue={data ? data.title : ""}/>
                    <Separator orientation="vertical"/>
                    <Input name="description" onChange={handleChange} className="shadow-sm border-none w-full focus:border-b placeholder:text-foreground" placeholder="Insert descrition..." defaultValue={data ? data.description : ""}/>
                    <Separator orientation="vertical"/>
                    <Button variant="outline" type="submit">Save</Button>
                    <Button variant="outline" type="reset" onClick={() => setShowForm(data ? { [data.id]: { edit: false, form: false } } : { "add": { form: false } })}><X /></Button>
                </div>
            </form>
        </li>
    )
}