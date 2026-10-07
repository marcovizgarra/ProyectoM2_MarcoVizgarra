// email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate :id route parameter
export const validateAuthorId = (req, res, next) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
            error: 'El ID del autor debe ser un número entero positivo, mayor que cero'
        });
    }

    return next();
};

// Validate body on POST /authors
export const validateCreateAuthor = (req, res, next) => {
    const { name, email, bio } = req.body || {};

    // name
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            error: 'El campo "nombre" es obligatorio y no debe estar vacío'
        });
    }

    if (!Number.isNaN(Number(name.trim()))) {
        return res.status(400).json({
            error: 'El campo "name" no puede ser un valor numérico'
        });
    }

    // email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({
            error: 'El campo "email" es obligatorio y debe ser un e-mail con formato válido'
        });
    }

    // bio (opcional)
    if (bio !== undefined) {
        if (typeof bio !== 'string') {
            return res.status(400).json({
                error: 'El campo "bio" debe ser un campo vacío o texto'
            });
        }

        if (bio.trim() !== '' && !Number.isNaN(Number(bio.trim()))) {
            return res.status(400).json({
                error: 'El campo "bio" no puede ser un valor numérico'
            });
        }
    }

    req.body.name = name.trim();
    req.body.email = email.trim();
    if (bio !== undefined) {
        req.body.bio = bio.trim();
    }

    return next();
};

// Validate body on PUT /authors/:id
export const validateUpdateAuthor = (req, res, next) => {
    const { name, email, bio } = req.body || {};

    // [CAMBIO] Se eliminó el req.body.name = name.trim() que estaba aquí arriba para que no explote si no se envía name en la actualización

    // Check if at least one field is provided
    if (name === undefined && email === undefined && bio === undefined) {
        return res.status(400).json({
            error: 'Al menos un campo ("name", "email", or "bio") debe ser actualizado'
        });
    }

    // name (opcional en PUT)

    // name
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                error: 'El campo "name" debe contener texto, no se admite un campo vacío'
            });
        }

        if (!Number.isNaN(Number(name.trim()))) {
            return res.status(400).json({
                error: 'El campo "name" no puede ser un valor numérico'
            });
        }

        req.body.name = name.trim();
    }

    // email
    if (email !== undefined) {
        if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return res.status(400).json({
                error: 'El campo "email" debe ser un e-mail válido'
            });
        }
        req.body.email = email.trim();
    }

    // bio
    if (bio !== undefined) {
        if (typeof bio !== 'string') {
            return res.status(400).json({
                error: 'El campo "bio" debe contener texto'
            });
        }

        if (bio.trim() !== '' && !Number.isNaN(Number(bio.trim()))) {
            return res.status(400).json({
                error: 'El campo "bio" no puede ser un valor numérico'
            });
        }

        req.body.bio = bio.trim();
    }

    return next();
};