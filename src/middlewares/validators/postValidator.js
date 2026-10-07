// Validate :id route parameter
export const validatePostId = (req, res, next) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
            error: 'El ID de la publicación debe ser un número entero positivo mayor que cero'
        });
    }

    return next();
};

// Validate :authorId route parameter
export const validateAuthorIdParam = (req, res, next) => {
    const { authorId } = req.params;
    const parsedAuthorId = Number(authorId);

    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
        return res.status(400).json({
            error: 'El ID del autor debe ser un número entero positivo mayor que cero'
        });
    }

    return next();
};

// Validate body on POST /posts
export const validateCreatePost = (req, res, next) => {
    const { author_id, title, content, published } = req.body || {};

    // author_id
    const parsedAuthorId = Number(author_id);
    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
        return res.status(400).json({
            error: 'El campo "author_id" es obligatorio y debe ser un número entero positivo'
        });
    }

    // title
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            error: 'El campo "title" es obligatorio y no debe estar vacío'
        });
    }
    if (!Number.isNaN(Number(title.trim()))) {
        return res.status(400).json({
            error: 'El campo "title" no puede ser un valor puramente numérico'
        });
    }

    // content
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
            error: 'El campo "content" es obligatorio y no debe estar vacío'
        });
    }

    if (!Number.isNaN(Number(content.trim()))) {
        return res.status(400).json({
            error: 'El campo "content" no puede ser un valor puramente numérico'
        });
    }

    // published (optional: boolean)
    if (published !== undefined && typeof published !== 'boolean') {
        return res.status(400).json({
            error: 'El campo "published" debe ser un valor booleano (true o false)'
        });
    }

    // Sanitize trimmed strings
    req.body.author_id = parsedAuthorId;
    req.body.title = title.trim();
    req.body.content = content.trim();

    return next();
};

// Validate body on PUT (update by id)
export const validateUpdatePost = (req, res, next) => {
    const { title, content, published } = req.body || {};

    // Check if at least one field is provided
    if (title === undefined && content === undefined && published === undefined) {
        return res.status(400).json({
            error: 'Al menos un campo ("title", "content" o "published") debe ser provisto para actualizar'
        });
    }

    // title (optional)
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                error: 'El campo "title" debe contener texto, no se admite un campo vacío'
            });
        }
        if (!Number.isNaN(Number(title.trim()))) {
            return res.status(400).json({
                error: 'El campo "title" no puede ser un valor puramente numérico'
            });
        }
        req.body.title = title.trim();
    }

    // content (optional)
    if (content !== undefined) {
        if (typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({
                error: 'El campo "content" debe contener texto, no se admite un campo vacío'
            });
        }

        if (!Number.isNaN(Number(content.trim()))) {
            return res.status(400).json({
                error: 'El campo "content" no puede ser un valor puramente numérico'
            });
        }

        req.body.content = content.trim();
    }

    // published (optional)
    if (published !== undefined) {
        if (typeof published !== 'boolean') {
            return res.status(400).json({
                error: 'El campo "published" debe ser un valor booleano (true o false)'
            });
        }
    }

    return next();
};