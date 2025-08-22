interface ApiResponse<T = TodoItem[]> {
    data?: T;
    message: string;
    error: boolean;
}
interface ErrorZod {
  path: string,
  message: string
}