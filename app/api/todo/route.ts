import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import z from "zod";
import DOMPurify from "isomorphic-dompurify"


const todoSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => DOMPurify.sanitize(typeof val == "number" ? val.toString() : val)),
  title: z.string().max(100).transform(val => DOMPurify.sanitize(val)),
  description: z.string().max(255).transform(val => DOMPurify.sanitize(val)),
  done: z.boolean().default(false),
  createdAt: z.string().transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid createdAt date"
    }),
  updateAt: z.string().transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid createdAt date"
    })
})

interface TodoItem extends z.infer<typeof todoSchema> {}

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": process.env.ALLOW_DOMAIN || "h",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Cookie",
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    const session = await getServerSession()
    if(session && session.user && session.user.email) {
        const db = await prisma.todos.findUnique({
            where: { email: session.user.email }
        })
        if(db) {
            const todoData: TodoItem[] = JSON.parse(Buffer.from(db.data, "base64").toString("utf-8"))
            if(todoData.every(i => "title" in i)) {
                return NextResponse.json({
                    message: "Sucess get data",
                    data: todoData,
                    error: false
                }, { status: 200, headers: corsHeaders })
            }
            return NextResponse.json({
                message: "Data todo in db is break",
                error: true
            }, { status: 409, headers: corsHeaders })
        }
        return NextResponse.json({
            message: "null data",
            error: true
        }, { status: 404, headers: corsHeaders })
    } else {
        return NextResponse.json({
            message: "permission invalid",
            error: true
        }, { status: 401, headers: corsHeaders })
    }

}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ErrorZod[]>>> {
    try {
        const session = await getServerSession()
        if(session && session.user) {
            const { data }: { data: string } = await request.json()
            const userData = await prisma.todos.count({
                where: { email: session.user.email ?? "" }
            })
            const extractData: TodoItem[] = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
            const validatedData = extractData.map(i => todoSchema.parse(i))
            const doneData = Buffer.from(JSON.stringify(validatedData), "utf-8").toString("base64")
            if(userData < 1) {
                await prisma.todos.create({
                    data: {
                        email: session.user.email ?? "",
                        data: doneData
                    }
                })
                return NextResponse.json({
                    error: false,
                    message: "Success save data"
                }, { status: 200, headers: corsHeaders })
            } else {
                await prisma.todos.update({
                    where: { email: session.user.email ?? "" },
                    data: {
                        data: doneData
                    }
                })
                return NextResponse.json({
                    error: false,
                    message: "Success save data"
                }, { status: 200, headers: corsHeaders })
            }
        } 
        return NextResponse.json({
            message: "permission invalid",
            error: true
        }, { status: 401, headers: corsHeaders })
    } catch (error) {
         if(error instanceof z.ZodError) {
            const errorMessage: ErrorZod[] = error.issues.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))

            return NextResponse.json({
                message: "Error Validating",
                data: errorMessage,
                error: true,
            }, { status: 400, headers: corsHeaders })
        }
        return NextResponse.json({
            message: "Unknown error",
            error: true
        }, { status: 500, headers: corsHeaders })
    }

}