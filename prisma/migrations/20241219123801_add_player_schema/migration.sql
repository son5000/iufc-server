-- CreateEnum
CREATE TYPE "PlayerType" AS ENUM ('선수', '군입대', '우선지명');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "type" "PlayerType" NOT NULL,
    "backNumber" TEXT,
    "name" TEXT NOT NULL,
    "englishName" TEXT,
    "currentTeam" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
