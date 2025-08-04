import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../app.js';

describe('app', () => {
	it('Testando health check da aplicação', async () => {
		const response = await request(app).get('/api');
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ mensagem: 'Bem vindo a api' });
	});
});
