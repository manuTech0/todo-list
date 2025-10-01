"use client";

import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useSessionStorage } from "@/lib/sessionStorage";
import { readApiTodo, saveApiTodo } from "@/lib/apiRequest";
import { useAuth } from "@/lib/useAuth";
export default function AppPage() {
  const [todos, setTodos] = useSessionStorage([]);
  const [input, setInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setTodos("ADD", {
      title: input.trim(),
      description: descInput.trim(),
      open: false,
      editing: false,
    });

    setInput("");
    setDescInput("");
  };

  const handleDelete = (id: string) => {
    setTodos("DELETE", {} as any, id);
  };

  const toggleOpen = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setTodos("UPDATE", { open: !todo.open }, id);
  };

  const toggleDone = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setTodos("UPDATE", { done: !todo.done }, id);
  };

  const toggleEdit = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setTodos("UPDATE", { editing: !todo.editing }, id);
  };

  const saveEdit = (id: string, newTitle: string, newDesc: string) => {
    setTodos("UPDATE", {
      title: newTitle.trim() || undefined,
      description: newDesc.trim() || undefined,
      editing: false,
    }, id);
  };

  const saveData = async () => {
        const dataLocal = localStorage.getItem("unsave")
        if(dataLocal) {
            const data = btoa(dataLocal)
            const res = await saveApiTodo(data)
            console.log(res)
        }
    }
    const syncData = async () => {
        const res = await readApiTodo()
        if("getTodos" in res?.data.data) {
            const data = res?.data.data.getTodos 
            const parsedTodo = JSON.parse(atob(data.data as string))
            setTodos("SYNC", parsedTodo)
        }
    }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col transition-colors">
      <Navbar syncData={syncData} saveData={saveData}/>

      <div className="flex flex-1 items-start justify-center p-4">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Your Todos
          </h1>

          {/* Form Add */}
          <form
            onSubmit={handleAddTodo}
            className="flex flex-col gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm w-full mb-4 text-left"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Todo title..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <input
              type="text"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-1 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium flex items-center gap-1 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <PlusCircle size={16} />
                Add
              </button>
            </div>
          </form>

          {/* List */}
          <ul className="w-full text-left space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 shadow-sm"
              >
                {todo.editing ? (
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <input
                      type="text"
                      defaultValue={todo.title}
                      id={`title-${todo.id}`}
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none border-b border-slate-200 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      defaultValue={todo.description}
                      id={`desc-${todo.id}`}
                      className="w-full bg-transparent text-sm text-slate-600 dark:text-slate-300 focus:outline-none border-b border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          const newTitle = (document.getElementById(`title-${todo.id}`) as HTMLInputElement).value;
                          const newDesc = (document.getElementById(`desc-${todo.id}`) as HTMLInputElement).value;
                          saveEdit(todo.id, newTitle, newDesc);
                        }}
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs flex items-center gap-1"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={() => toggleEdit(todo.id)}
                        className="px-2 py-1 rounded bg-slate-400 text-white text-xs flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleDone(todo.id)}
                          aria-label="Toggle done"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {todo.done ? (
                            <CheckSquare size={16} className="text-indigo-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                        <span className={todo.done ? "line-through" : ""}>
                          {todo.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleOpen(todo.id)}
                          aria-label="Toggle description"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {todo.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={() => toggleEdit(todo.id)}
                          aria-label="Edit todo"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          aria-label="Delete todo"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {todo.open && todo.description && (
                      <div className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400">
                        {todo.description}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
