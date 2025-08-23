-- CreateTable
CREATE TABLE "public"."Todos" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todos_email_key" ON "public"."Todos"("email");
