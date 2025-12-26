-- CreateTable
CREATE TABLE "Categorias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projetos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "tags" TEXT[],
    "banner" TEXT NOT NULL,
    "images" TEXT[],
    "Description" TEXT NOT NULL,
    "technologies" TEXT[],
    "year" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postagens" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "banner" TEXT NOT NULL,
    "readTime" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Postagens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postagens" ADD CONSTRAINT "Postagens_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
