import { Router } from "express";
import {
    getAuthors,
    getAuthor,
    addAuthor,
    editAuthor,
    removeAuthor
} from '../controllers/authorController.js';

const router = Router();

// GET /authors (supports ?email=ana@example.com)
router.get('/', getAuthors);
router.get('/:id', getAuthor);

router.post('/', addAuthor);

router.put('/:id', editAuthor);

router.delete('/:id', removeAuthor);

export default router;