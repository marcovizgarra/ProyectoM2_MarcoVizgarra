import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/dbConnect.js';

describe('Authors Endpoints', () => {
    let createdAuthorId;

    afterAll(async () => {
        await pool.end(); // kill pool connections
    });

    describe('GET /authors', () => {
        it('should return a list of authors with status 200', async () => {
            const res = await request(app).get('/authors');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /authors', () => {
        it('should create a new author with status 201', async () => {
            const uniqueEmail = `test_${Date.now()}@example.com`;
            const res = await request(app)
                .post('/authors')
                .send({
                    name: 'Testing Author',
                    email: uniqueEmail,
                    bio: 'Author created for automated tests'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.email).toBe(uniqueEmail);

            createdAuthorId = res.body.id;
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post('/authors')
                .send({
                    name: ''
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /authors/:id', () => {
        it('should return author details with status 200', async () => {
            const res = await request(app).get(`/authors/${createdAuthorId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(createdAuthorId);
        });

        it('should return 400 if ID is invalid', async () => {
            const res = await request(app).get('/authors/abc');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 404 if author does not exist', async () => {
            const res = await request(app).get('/authors/999999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /authors/:id', () => {
        it('should update an author with status 200', async () => {
            const res = await request(app)
                .put(`/authors/${createdAuthorId}`)
                .send({
                    name: 'Testing Author Updated'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Testing Author Updated');
        });

        it('should return 400 if body is empty', async () => {
            const res = await request(app)
                .put(`/authors/${createdAuthorId}`)
                .send({});

            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /authors/:id', () => {
        it('should delete the author with status 200 and a confirmation message', async () => {
            const res = await request(app).delete(`/authors/${createdAuthorId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 404 when trying to delete non-existing author', async () => {
            const res = await request(app).delete(`/authors/${createdAuthorId}`);

            expect(res.statusCode).toBe(404);
        });
    });
});