-- CreateTable
CREATE TABLE "KaderAssignment" (
    "id" TEXT NOT NULL,
    "kaderId" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KaderAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KaderAssignment_motherId_key" ON "KaderAssignment"("motherId");

-- CreateIndex
CREATE UNIQUE INDEX "KaderAssignment_kaderId_motherId_key" ON "KaderAssignment"("kaderId", "motherId");

-- AddForeignKey
ALTER TABLE "KaderAssignment" ADD CONSTRAINT "KaderAssignment_kaderId_fkey" FOREIGN KEY ("kaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KaderAssignment" ADD CONSTRAINT "KaderAssignment_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
