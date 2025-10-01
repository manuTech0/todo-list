import axios from 'axios';
import cookie from "js-cookie";

const token = cookie.get("token")

export async function saveApiTodo(data: string) {  
  try {
    const query = `
      mutation SaveTodos {
        saveTodos(
          data: "${data}"
        ) {
          data
          todosId
          userId
        }
      }
    `
    const res = await axios.post((process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000") + "/graphql", { query },  {
      withCredentials: true
    })
    return res
  } catch (error) {
  }
}
export async function readApiTodo() {
  try {
    const query = `
      query My {
        getTodos {
          data
          todosId
          userId
          user {
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
      }
    `
    const res = await axios.post((process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000") + "/graphql", { query },  {
      withCredentials: true
    })
    return res
  } catch (error) {
  }
}