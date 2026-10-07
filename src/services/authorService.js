import { query } from '../config/dbConnect.js';

// get all authors
export const getAllAuthors = async () => {
    const sqlQuery = `
        SELECT id, name, email, bio, created_at
        FROM authors
        ORDER BY id ASC;
    `
    const result = await query(sqlQuery);
    return result.rows;
};

// get a single author by ID
export const getAuthorById = async (id) => {
    const sqlQuery = `
        SELECT id, name, email, bio, created_at
        FROM authors
        WHERE id = $1;
    `;
    const result = await query(sqlQuery, [id]);
    return result.rows[0] || null;
};

// find an author by email
export const getAuthorByEmail = async (email) => {
    const sqlQuery = `
        SELECT id, name, email, bio, created_at
        FROM authors
        WHERE email = $1;
    `;
    const result = await query(sqlQuery, [email]);
    return result.rows[0] || null;
}

// create a new author
export const createAuthor = async ({ name, email, bio }) => {
    const sqlQuery = `
        INSERT INTO authors (name, email, bio)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, bio, created_at;
    `;
    const result = await query(sqlQuery, [name, email, bio] || null);
    return result.rows[0];
}

// update an existing author
export const updateAuthor = async (id, { name, email, bio } = {}) => {
    const sql = `
        UPDATE authors
        SET 
            name    = COALESCE($1, name),
            email   = COALESCE($2, email),
            bio     = COALESCE($3, bio)
        WHERE id = $4
        RETURNING id, name, email, bio, created_at;
    `;

    const params = [
        name ?? null,
        email ?? null,
        bio ?? null,
        id
    ];

    const result = await query(sql, params);
    return result.rows[0] || null;
}

// delete an author by ID
export const deleteAuthor = async (id) => {
    const sqlQuery = `
        DELETE FROM authors
        WHERE id = $1
        RETURNING id;
    `;
    const result = await query(sqlQuery, [id]);
    return result.rowCount > 0;
};