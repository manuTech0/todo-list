import axios, { AxiosHeaders, AxiosResponse } from 'axios';
export async function apiRequest(method: "GET" | "POST" | "DELETE" | "PUT", path: string, body?: Object): Promise<ApiResponse> {
    const baseurl = process.env?.API_URL || "http://localhost:3000" + "/api"
    const defaultHeaders: HeadersInit = {
        "Content-Type": "applications/json"
    }
    let response: undefined | AxiosResponse = undefined
    switch (method) {
        case "GET":
            response = await axios.get(baseurl + path, {
                headers: defaultHeaders
            })
            break;
        case "POST":
            response = await axios.post(baseurl + path, body, {
                headers: defaultHeaders
            })
            break;
        case "PUT":
            response = await axios.put(baseurl + path, body, {
                headers: defaultHeaders
            })
            break;
        case "DELETE":
            response = await axios.delete(baseurl + path + body as string, {
                headers: defaultHeaders
            })
            break;
        default:
            return { error: true, message: "Not selected method" }
    }
    if(!(response?.data as ApiResponse).error) {
        return response?.data as ApiResponse
    } else {
        return response?.data as ApiResponse
    }
}