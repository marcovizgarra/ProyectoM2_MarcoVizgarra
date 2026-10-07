import { Router } from "express"
import authorRoutes from './authorRoutes.js'
import postRoutes from './postRoutes.js';

const router = Router();

router.use('/authors', authorRoutes);
router.use('/posts', postRoutes)

export default router;