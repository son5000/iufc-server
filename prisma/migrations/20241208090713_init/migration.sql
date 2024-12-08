-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('notice', 'news', 'cheeringGrounds', 'report');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "userPw" TEXT NOT NULL,
    "userPhoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "favoritPlayer" TEXT NOT NULL,
    "selectedJob" TEXT,
    "singleOrMarried" TEXT,
    "advertisement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "type" "PostType" NOT NULL,
    "title" TEXT NOT NULL,
    "views" INTEGER,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userPhoneNumber_key" ON "User"("userPhoneNumber");
