import prisma from '../../lib/prisma.js';

/**
 * Helper para formatar o objeto de retorno
 */
function mapPost(post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    contentType: post.contentType,
    status: post.status,
    publishedAt: post.publishedAt,
    author: post.author,
    featuredImage: post.featuredImage,
    readTime: post.readTime,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    category: post.category ? {
      id: post.category.id,
      name: post.category.name,
    } : null,
  };
}

/**
 * Gera um slug simples a partir do título
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-') // Substitui não alfanuméricos por hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens do começo/fim
}

/**
 * Calcula tempo de leitura (média de 200 palavras por minuto)
 */
function calculateReadTime(content) {
  const text = content || "";
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return `${time} min`;
}

/**
 * CREATE
 */
export async function createPost(data) {
  if (!data.categoryId) {
    throw new Error('categoryId é obrigatório');
  }

  // Gera slug se não for enviado
  const slug = data.slug || generateSlug(data.title);
  
  // Verifica se slug já existe
  const slugExists = await prisma.post.findUnique({ where: { slug } });
  if (slugExists) {
    throw new Error('Já existe um post com este título/slug. Por favor, altere o slug.');
  }

  // Calcula tempo de leitura se não enviado
  const readTime = data.readTime || calculateReadTime(data.content);

  // Define data de publicação se o status for PUBLISHED
  const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: slug,
      excerpt: data.excerpt,
      content: data.content,
      contentType: data.contentType || 'MARKDOWN',
      status: data.status || 'DRAFT',
      publishedAt: data.publishedAt || publishedAt,
      author: data.author,
      featuredImage: data.featuredImage,
      readTime: readTime,
      categoryId: Number(data.categoryId),
    },
    include: {
      category: true,
    },
  });

  return mapPost(post);
}

/**
 * READ ALL (Com filtros opcionais)
 */
export async function getAllPosts(filters = {}) {
  const { status, categoryId } = filters;
  
  const where = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = Number(categoryId);

  const posts = await prisma.post.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts.map(mapPost);
}

/**
 * READ BY SLUG (Para o Frontend Público)
 */
export async function getPostBySlug(slug) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!post) return null;
  return mapPost(post);
}

/**
 * READ BY ID (Para o Admin/Edição)
 */
export async function getPostById(id) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });

  if (!post) return null;
  return mapPost(post);
}

/**
 * UPDATE
 */
export async function updatePost(id, data) {
  const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!existingPost) throw new Error('Post não encontrado');

  const updateData = { ...data };
  
  // Lógica para publishedAt ao mudar status
  if (data.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' && !data.publishedAt) {
    updateData.publishedAt = new Date();
  }

  // Se o conteúdo mudou, recalcula o readTime (opcional)
  if (data.content) {
    updateData.readTime = calculateReadTime(data.content);
  }

  if (data.categoryId) {
    updateData.categoryId = Number(data.categoryId);
  }

  // Limpeza de campos
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.category;

  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      category: true,
    },
  });

  return mapPost(post);
}

/**
 * DELETE
 */
export async function deletePost(id) {
  return prisma.post.delete({
    where: { id: Number(id) },
  });
}