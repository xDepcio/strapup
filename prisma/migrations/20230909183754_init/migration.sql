-- CreateTable
CREATE TABLE "StrapupStats" (
    "id" SERIAL NOT NULL,
    "templatesSaved" INTEGER NOT NULL,
    "templatesPasted" INTEGER NOT NULL,
    "scriptsRun" INTEGER NOT NULL,

    CONSTRAINT "StrapupStats_pkey" PRIMARY KEY ("id")
);
