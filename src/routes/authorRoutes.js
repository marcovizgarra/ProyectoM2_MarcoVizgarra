import { Router } from "express";
import { validateAuthorId, validateCreateAuthor, validateUpdateAuthor } from '../middlewares/validators/authorValidator.js'
import { getAuthors, getAuthor, addAuthor, editAuthor, removeAuthor } from '../controllers/authorController.js';

const router = Router();

// GET /authors (supports ?email=ana@example.com)
router.get('/', getAuthors);
router.get('/:id', validateAuthorId, getAuthor);

router.post('/', validateCreateAuthor, addAuthor);

router.put('/:id', validateAuthorId, validateUpdateAuthor, editAuthor);

router.delete('/:id', validateAuthorId, removeAuthor);

export default router;