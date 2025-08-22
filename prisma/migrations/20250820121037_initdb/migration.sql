/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Todos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Todos` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `Todos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Todos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Todos` table. All the data in the column will be lost.
  - Added the required column `data` to the `Todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Todos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_Todos" ("id") SELECT "id" FROM "Todos";
DROP TABLE "Todos";
ALTER TABLE "new_Todos" RENAME TO "Todos";
CREATE UNIQUE INDEX "Todos_email_key" ON "Todos"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
