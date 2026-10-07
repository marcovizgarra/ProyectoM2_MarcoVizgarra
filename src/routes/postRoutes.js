import { Router } from 'express';
import { validatePostId, validateAuthorIdParam, validateCreatePost, validateUpdatePost } from '../middlewares/validators/postValidator.js';
import { getPosts, getPost, getPostsByAuthor, addPost, editPost, removePost } from '../controllers/postController.js';

const router = Router();

router.get('/', getPosts);

router.get('/author/:authorId', validateAuthorIdParam, getPostsByAuthor);
router.get('/:id', validatePostId, getPost);

router.post('/', validateCreatePost, addPost);

router.put('/:id', validatePostId, validateUpdatePost, editPost);

router.delete('/:id', validatePostId, removePost);

export default router;