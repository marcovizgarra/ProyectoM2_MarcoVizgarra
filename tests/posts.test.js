import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/dbConnect.js';

describe('Posts Endpoints', () => {
    let createdPostId;
    const authorId = 1; // Asegúrate de que exista en tu base de datos local

    afterAll(async () => {
        await pool.end();
    });

    describe('GET /posts', () => {
        it('should return a list of posts with status 200', async () => {
            const res = await request(app).get('/posts');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /posts', () => {
        it('should create a new post with status 201', async () => {
            const res = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Post de prueba automatizada',
                    content: 'Contenido válido para el test',
                    published: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            createdPostId = res.body.id;
        });

        it('should return 400 when required fields are missing', async () => {
            const res = await request(app)
                .post('/posts')
                .send({
                    title: 'Solo un título'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /posts/:id', () => {
        it('should return post details with status 200', async () => {
            const res = await request(app).get(`/posts/${createdPostId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(createdPostId);
        });

        it('should return 404 if post does not exist', async () => {
            const res = await request(app).get('/posts/999999');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('DELETE /posts/:id', () => {
        it('should delete the post with status 200 and a confirmation message', async () => {
            const res = await request(app).delete(`/posts/${createdPostId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
        });
    });
});