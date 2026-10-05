import {
  getAllAuthors,
  getAuthorById,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../services/authorService.js';

// GET /authors
export const getAuthors = async (req, res, next) => {
  try {
    const { email } = req.query;

    // If an email query parameter is provided, filter by email
    if (email) {
      const author = await getAuthorByEmail(email);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      return res.status(200).json(author);
    }

    // If no email provided return all authors
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

// GET /authors/:id
export const getAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

// POST /authors
export const addAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    // Check duplicated emails
    const existingAuthor = await getAuthorByEmail(email);
    if (existingAuthor) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const newAuthor = await createAuthor({ name, email, bio });
    return res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
};

// PUT /authors/:id
export const editAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body || {};

    // Check if author exists
    const author = await getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Check if email exists
    if (email && email !== author.email) {
      const emailInUse = await getAuthorByEmail(email);
      if (emailInUse) {
        return res.status(409).json({ error: 'Email already in use by another author' });
      }
    }

    const updatedAuthor = await updateAuthor(id, { name, email, bio });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    next(error);
  }
};

// DELETE /authors/:id
export const removeAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteAuthor(id);

    if (!isDeleted) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json({ message: `Autor con id ${id} eliminado satisfactoriamente` });
  } catch (error) {
    next(error);
  }
};