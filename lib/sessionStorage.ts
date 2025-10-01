"use client"
import { useEffect, useState } from "react"
import * as uuid from "uuid"

interface TodoItem {
  id: string
  title: string
  description: string
  done: boolean
  open: boolean
  editing: boolean
  createdAt: Date
  updateAt: Date
}

interface ModTodo {
  title?: string
  description?: string
  done?: boolean
  open?: boolean
  editing?: boolean
}

export function useSessionStorage(initialData: TodoItem[] = []) {
  const key = "unsave"

  const [value, setValue] = useState<TodoItem[]>(() => {
    if (typeof window === "undefined") return initialData
    try {
      const localData = localStorage.getItem(key)
      if (localData) {
        const parsed: TodoItem[] = JSON.parse(localData)
        return parsed.map(t => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updateAt: new Date(t.updateAt)
        }))
      }
    } catch (err) {
      console.error("Error parsing localStorage", err)
    }
    return initialData
  })

  // // Load dari localStorage
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const localData = localStorage.getItem(key)
  //     if (localData) {
  //       try {
  //         const parsed: TodoItem[] = JSON.parse(localData)
  //         // Convert string ke Date object
  //         const withDates = parsed.map((t) => ({
  //           ...t,
  //           createdAt: new Date(t.createdAt),
  //           updateAt: new Date(t.updateAt),
  //         }))
  //         setValue(withDates)
  //       } catch (err) {
  //         setValue(initialData)
  //         localStorage.setItem(key, JSON.stringify(initialData))
  //       }
  //     } else {
  //       setValue(initialData)
  //       localStorage.setItem(key, JSON.stringify(initialData))
  //     }
  //   }
  // }, [])

  useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  const updateValue = (
    method: "ADD" | "DELETE" | "SYNC" | "UPDATE",
    newValue: ModTodo | TodoItem | TodoItem[],
    id?: string
  ): void | boolean => {
    if (method === "ADD" && typeof newValue === "object" && !Array.isArray(newValue)) {
      const newTodo: TodoItem = {
        id: uuid.v4(), // pake v4 biar unik
        title: newValue.title ?? "Untitled",
        description: newValue.description ?? "",
        done: false,
        open: (newValue as ModTodo).open ?? false,
        editing: (newValue as ModTodo).editing ?? false,
        createdAt: new Date(),
        updateAt: new Date(),
      }
      setValue((prev) => [...prev, newTodo])

    } else if (method === "UPDATE" && id) {
      setValue((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, ...newValue, updateAt: new Date() }
            : todo
        )
      )

    } else if (method === "DELETE" && id) {
      setValue((prev) => prev.filter((todo) => todo.id !== id))

    } else if (method === "SYNC" && Array.isArray(newValue)) {
        console.log(newValue)
      setValue((prev) => {
        const isSame =
          prev.length === newValue.length &&
          prev.every(
            (item, index) => JSON.stringify(item) === JSON.stringify(newValue[index])
          )

        if (isSame) return prev
        return newValue as TodoItem[]
      })
    }
  }

  return [value, updateValue] as const
}
