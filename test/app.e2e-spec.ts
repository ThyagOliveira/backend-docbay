import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /github/thyagoliveira - should creat or update github user', async () => {
    const response = await request(app.getHttpServer())
      .post('/github/thyagoliveira')
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.githubId).toBeDefined();
    expect(response.body.languages).toBeInstanceOf(Array);
  });

  it('POST /github/thyagoliveiraFakeUser - should return 404', async () => {
    const response = await request(app.getHttpServer())
      .post('/github/thyagoliveiraFakeUser')
      .expect(404);

    expect(response.body).toHaveProperty('statusCode', 404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it('GET /github - should return users list', async () => {
    const response = await request(app.getHttpServer())
      .get('/github')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /github?language=TypeScript - should apply filter by language', async () => {
    const response = await request(app.getHttpServer())
      .get('/github?language=TypeScript')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /github?location=Porto - should apply filter by location', async () => {
    const response = await request(app.getHttpServer())
      .get('/github?location=Porto')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /github?age=10 - should return 400 (unknown query param)', async () => {
    const response = await request(app.getHttpServer())
      .get('/github?age=10')
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body.message).toContain('property age should not exist');
  });

  it('GET /github?language=JavaScript&xpto=abc - should return 400 (unknown param xpto)', async () => {
    const response = await request(app.getHttpServer())
      .get('/github?language=JavaScript&xpto=abc')
      .expect(400);

    expect(response.body.message).toContain('property xpto should not exist');
  });
});
