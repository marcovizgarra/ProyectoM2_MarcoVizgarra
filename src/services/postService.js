import { query } from '../config/dbConnect.js';

// Get all posts
export const getAllPosts = async () => {
    const sql = `
    SELECT id, author_id, title, content, published, created_at
    FROM posts
    ORDER BY id ASC;
  `;
    const result = await query(sql);
    return result.rows;
};

// Get a single post by ID
export const getPostById = async (id) => {
    const sql = `
    SELECT id, author_id, title, content, published, created_at
    FROM posts
    WHERE id = $1;
  `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
};

// Get all posts belonging to a specific author
export const getPostsByAuthorId = async (authorId) => {
    const sql = `
    SELECT id, author_id, title, content, published, created_at
    FROM posts
    WHERE author_id = $1
    ORDER BY id ASC;
  `;
    const result = await query(sql, [authorId]);
    return result.rows;
};

// Create a new post
export const createPost = async ({ author_id, title, content, published = false }) => {
    const sql = `
    INSERT INTO posts (author_id, title, content, published)
    VALUES ($1, $2, $3, $4)
    RETURNING id, author_id, title, content, published, created_at;
  `;
    const params = [author_id, title, content, published];
    const result = await query(sql, params);
    return result.rows[0];
};

// Update an existing post by ID
export const updatePost = async (id, { title, content, published } = {}) => {
    const sql = `
    UPDATE posts
    SET 
      title     = COALESCE($1, title),
      content   = COALESCE($2, content),
      published = COALESCE($3, published)
    WHERE id = $4
    RETURNING id, author_id, title, content, published, created_at;
  `;
    const params = [
        title ?? null,
        content ?? null,
        published ?? null,
        id
    ];
    const result = await query(sql, params);
    return result.rows[0] || null;
};

// Delete a post by ID
export const deletePost = async (id) => {
    const sql = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING id;
  `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
};