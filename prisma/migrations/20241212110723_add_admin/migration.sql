-- CreateTable
CREATE TABLE "Admin" (
    "userId" TEXT NOT NULL,
    "userPw" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");
