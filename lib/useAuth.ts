import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    createdAt: Date
    email: string
    fullname: string
    password?: string
    profilePicture?: string
    provider: string
    role?: string
    status?: string
    updateAt: Date
    userId: string
    username: string
    verified: boolean
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.manu-tech.my.id"

export function useAuth() {
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState<User | undefined>(undefined)
    useEffect(() => {
        const query = `
            query MyQuery {
                me {
                    createdAt
                    email
                    fullname
                    password
                    profilePicture
                    provider
                    role
                    status
                    updateAt
                    userId
                    username
                    verified
                }
            }
        `;
        (async () => {
            const res = await axios.post(apiUrl + "/graphql", { query },  {
                withCredentials: true
            })
            if("me" in res.data.data) {
                const myUser = res.data.data.me
                if(myUser) {
                    setIsAuth(true)
                    setUser(myUser)
                }
            }
        })()
    }, [])
    return { isAuth, user } as const
}