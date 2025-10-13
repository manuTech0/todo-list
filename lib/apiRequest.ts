import axios from 'axios';
import cookie from "js-cookie";

const token = cookie.get("token")
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.manu-tech.my.id") + "/graphql"
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
    const res = await axios.post(apiUrl, { query },  {
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
    const res = await axios.post(apiUrl, { query },  {
      withCredentials: true
    })
    return res
  } catch (error) {
  }
}