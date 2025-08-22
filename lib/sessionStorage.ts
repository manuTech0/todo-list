"use client"
import { useEffect, useState } from "react"
import * as uuid from "uuid"


export function useSessionStorage(initialData: TodoItem[] = []) {
    const key = "unsave"

    const [value, setValue] = useState<TodoItem[]>([])
    useEffect(() => {
        if (typeof window !== "undefined") {
            const localData = localStorage.getItem(key)
            if (localData) {
                try {
                    const parsed = JSON.parse(localData)
                    setValue(parsed)
                } catch (err) {
                    setValue(initialData)
                    localStorage.setItem(key, JSON.stringify(initialData))
                }
            } else {
                setValue(initialData)
                localStorage.setItem(key, JSON.stringify(initialData))
            }
        }
    }, [])
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [value])

    const updateValue = (
        method: "ADD" | "DELETE" | "SYNC" | "UPDATE",
        newValue: ModTodo | TodoItem | TodoItem[],
        id?: string
    ): void | boolean => {
        if (method === "ADD" && typeof newValue === "object" && !Array.isArray(newValue)) {
            const newTodo: TodoItem = {
                ...newValue,
                id: uuid.v6(),
                done: false,
                createdAt: new Date(),
                updateAt: new Date(),
            }
            setValue(prev => [...prev, newTodo])
        } else if (method === "UPDATE" && id) {
            setValue(prev =>
                prev.map(todo =>
                todo.id === id
                    ? { ...todo, ...newValue, updateAt: new Date() }
                    : todo
                )
            )
        } else if (method === "DELETE" && id) {
            setValue(prev => prev.filter(todo => todo.id !== id))
        } else if (method === "SYNC" && Array.isArray(newValue)) {
           setValue(prev => {
                const isSame =
                    prev.length === newValue.length &&
                    prev.every((item, index) => JSON.stringify(item) === JSON.stringify(newValue[index]))

                if (isSame) return prev

                return newValue
            })
        } 
    }

    return [value, updateValue] as const
}
