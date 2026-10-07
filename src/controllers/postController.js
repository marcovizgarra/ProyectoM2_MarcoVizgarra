import { getAllPosts, getPostById, getPostsByAuthorId, createPost, updatePost, deletePost } from '../services/postService.js'

// GET all posts
export const getPosts = async (res, next) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// GET posts by id
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// GET post by authorId
export const getPostsByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    // Verify if the author exists
    const author = await getAuthorById(authorId);
    if (!author) {
      return res.status(404).json({
        error: 'Autor no encontrado'
      });
    }

    const posts = await getPostsByAuthorId(authorId);
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// POST add new post
export const addPost = async (req, res, next) => {
  try {
    const { author_id, title, content, published } = req.body;

    // Verify ferenced author exists
    const author = await getAuthorById(author_id);
    if (!author) {
      return res.status(404).json({
        error: 'El autor especificado no existe'
      });
    }

    const newPost = await createPost({
      author_id,
      title,
      content,
      published
    });

    return res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// PUT update or modify posts by id
export const editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    // Check if the post exists
    const existingPost = await getPostById(id);
    if (!existingPost) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    const updatedPost = await updatePost(id, { title, content, published });
    return res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// DELETE posts by id
export const removePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await deletePost(id);

    if (!isDeleted) {
      return res.status(404).json({
        error: 'Publicación no encontrada'
      });
    }

    return res.status(200).json({ message: `Post eliminado satisfactoriamente` });
  } catch (error) {
    next(error);
  }
};