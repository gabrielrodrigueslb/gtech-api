import { 
  createPost, 
  getAllPosts, 
  getPostBySlug, 
  getPostById, 
  updatePost, 
  deletePost 
} from '../services/postServices.js';

export async function createPostController(req, res) {
  try {
    const data = req.body;
    const post = await createPost(data);
    return res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllPostsController(req, res) {
  try {
    // Permite filtrar via query params: ?status=PUBLISHED&categoryId=1
    const filters = {
      status: req.query.status,
      categoryId: req.query.categoryId
    };
    
    const posts = await getAllPosts(filters);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar posts.' });
  }
}

// Busca pública pelo SLUG
export async function getPostBySlugController(req, res) {
  try {
    const { slug } = req.params;
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Busca administrativa pelo ID
export async function getPostByIdController(req, res) {
  try {
    const { id } = req.params;
    const post = await getPostById(Number(id));
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updatePostController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPost = await updatePost(Number(id), data);
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Post não encontrado para edição.' });
    }
    return res.status(400).json({ error: error.message });
  }
}

export async function deletePostController(req, res) {
  try {
    const { id } = req.params;
    await deletePost(Number(id));
    
    return res.status(200).json({ message: 'Post excluído com sucesso.' });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Post não encontrado para exclusão.' });
    }
    return res.status(400).json({ error: error.message });
  }
}