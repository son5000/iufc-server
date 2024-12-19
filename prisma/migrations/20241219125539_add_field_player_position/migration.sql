-- CreateEnum
CREATE TYPE "Position" AS ENUM ('골키퍼', '수비수', '미드필더', '공격수');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "position" "Position";
