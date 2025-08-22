"use client"
import { LineForm } from "@/components/form"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { apiRequest } from "@/lib/apiRequest"
import { useSessionStorage } from "@/lib/sessionStorage"
import { EllipsisVertical, PenLine, Trash } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

function isEqualTodoList(a: TodoItem[], b: TodoItem[]): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        const itemA = a[i]
        const itemB = b[i]
        if (
            itemA.title !== itemB.title ||
            itemA.description !== itemB.description ||
            itemA.done !== itemB.done ||
            new Date(itemA.createdAt).getTime() !== new Date(itemB.createdAt).getTime() ||
            new Date(itemA.updateAt).getTime() !== new Date(itemB.updateAt).getTime()
        ) {
            return false
        }
    }
    return true
}

export default function MyPaper() {
    const [apiData, setApiData] = React.useState<TodoItem[] | undefined>(undefined)
    const [filteredTodos, setFilteredTodos] = React.useState<TodoItem[] | undefined>(undefined)
    const [search, setSearch] = React.useState<string>("")
    const [unsave, setUnsave] = React.useState(false)
    const [inputValue, setInputValue] = React.useState<{ id?: string, title: string, description: string } | undefined>(undefined)
    const [showForm, setShowForm] = React.useState<{
        [key: number | string]: {
            form: boolean;
            edit?: boolean;
        };
    } | undefined>(undefined)
    const [checkeds, setCheckeds] = React.useState<{
        listChecked: {
            [key: string]: {
                checked: boolean
            }
        }
    }>({ listChecked: { "0": { checked: false } }})
    const [todos, updateTodos] = useSessionStorage([])
    React.useEffect(() => {
        (async () => {
            const api = await apiRequest("GET", "/todo")
            setApiData(api.data)
        })()
    }, [])
    React.useEffect(() => {
        if(apiData) {
            updateTodos("SYNC", apiData)
        }
    }, [apiData])
    React.useEffect(() => {
        if(todos) {
            setFilteredTodos(todos.filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase())))
        }
        const initialChecks: { [key: string]: { checked: boolean } } = {}
        todos.forEach((data: TodoItem) => {
            if(!data) return
            initialChecks[data.id] = { checked: data.done }
        })
        setCheckeds({ listChecked: initialChecks })
    }, [search, todos])
    React.useEffect(() => {
        if(apiData) {
            const isSame = isEqualTodoList(apiData, todos)
            setUnsave(!isSame)
        }
    }, [todos, checkeds])

    const editSubmit = (val: React.FormEvent<HTMLFormElement>) => {
        val.preventDefault()
        updateTodos("UPDATE", inputValue as ModTodo, inputValue?.id)
        setShowForm({
            [inputValue?.id || 0]: { edit: false, form: false }
        })
    }
    const addSubmit = (val: React.FormEvent<HTMLFormElement>) => {
        val.preventDefault()
        updateTodos("ADD", inputValue as ModTodo, inputValue?.id)
        setShowForm({
            "add": { edit: false, form: false }
        })
    }
    const handleCheckeds = (val: boolean, id: string) => {
        updateTodos("UPDATE", {
            ...(todos.find(i => i.id == id)),
            updateAt: new Date(),
            done: val
        } as TodoItem, id)
        setCheckeds((p) => ({ listChecked: { ...p.listChecked, [id]: { checked: val } }}))
    }
    const handleSave = () => {
        toast.promise(apiRequest("POST", "/todo", { 
            data: btoa(unescape(encodeURIComponent(JSON.stringify(todos))))
        }), {
            loading: "Saveing...",
            success: (data: ApiResponse<unknown>) => {
                if(data.error) {
                    if(Array.isArray(data.data) && (data.data as ErrorZod[]).every((i) => typeof i == "object" && typeof i.path == "string" && typeof i.message == "string")) {
                        return (data.data as ErrorZod[]).map(i => `Field ${i.path}: ${i.message}`).join("<br />")
                    }
                    return data.message
                }
                return data.message
            }, 
            error:  error => error.response?.data?.message || error.message || "Terjadi kesalahan saat mengambil data."
        })
    }
    const deleteHandle = (id: string) => {
        updateTodos("DELETE", [], id)
    }

    return (
        <div className="bg-slate-100 h-full w-screen">
            <Navbar handleSync={() => updateTodos("SYNC", apiData ?? [])} setSearch={setSearch} setShowForm={setShowForm} unsave={unsave} handleSave={handleSave}/>
            <ul 
                className="px-10 pt-12 pb-14 bg-yellow-500 shadow-lg w-full h-full"
            >
                {((!filteredTodos || filteredTodos.length < 9) ? [...((!filteredTodos) ? [] : filteredTodos), ...Array(9 - ((!filteredTodos) ? 0 : filteredTodos!.length))] : filteredTodos).map((todo: TodoItem, i) => (
                    <li key={todo?.id ?? i} className="w-full pb-2 h-16 px-2 text-2xl border-b-2 border-black flex space-between items-center">
                        { filteredTodos  && filteredTodos.length == i && showForm && showForm["add"] && showForm["add"].form ? (
                            <LineForm setShowForm={setShowForm} formHandle={addSubmit} inputHandle={setInputValue}/>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                        { todo && filteredTodos ? (
                                            <div className="w-full">
                                                { showForm && showForm[todo.id] && showForm[todo.id].form && showForm[todo.id].edit ? (
                                                    <LineForm formHandle={editSubmit} data={todo} inputHandle={setInputValue} setShowForm={setShowForm}/>
                                                ) : (
                                                    <div className="flex justify-between w-full items-center h-full">
                                                        <Checkbox className="border-black checked:border-black" checked={checkeds.listChecked[todo.id] && checkeds.listChecked[todo.id].checked} onCheckedChange={(val: boolean) => handleCheckeds(val, todo.id)}/>
                                                        <div className="flex justify-between w-full items-center h-full">
                                                            <div className="ms-5 w-full">
                                                                <h1 className={`${todo && filteredTodos && checkeds.listChecked[todo.id] && checkeds.listChecked[todo.id].checked ? "line-through" : ""} `}>{ todo.title }</h1>
                                                                <span className="text-sm w-full text-gray-500 flex sm:flex-col sm:text-xs md:text-xs md:flex-col lg:flex-row">
                                                                    { new Date(todo.updateAt).toLocaleString("en-US", {
                                                                        year: "numeric",    
                                                                        month: "long",
                                                                        day: "2-digit",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuLabel>Settings Menu</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem>
                                                                        <Button variant="ghost" className="decoration-none no-underline rounded-r-none" onClick={() => setShowForm({ [todo.id]: { edit: true, form: true } })}><PenLine /> Edit</Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Button variant="ghost" className="decoration-none no-underline rounded-l-none" onClick={() => deleteHandle(todo.id)}><Trash /> Delete</Button>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            (i == 0) ? (
                                                    <span className="ms-5 text-center w-full text-gray">Not Found</span>
                                            ) : ""
                                        )}
                                </TooltipTrigger>
                                { todo && filteredTodos && todo.description ? (
                                    <TooltipContent side="bottom">
                                        { filteredTodos ? todo.description : <></>}
                                    </TooltipContent>
                                ) : <></>}
                            </Tooltip>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}