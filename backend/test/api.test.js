const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');
const { sequelize, User } = require('../models');

let userToken;
let employerToken;
let adminToken;
let categoryId;
let jobId;

describe('JobPortal API Integration Tests', function() {
  this.timeout(15000);

  before(async () => {
    await sequelize.sync({ force: true });

    await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@test.com', password: 'password123', role: 'USER' });
      
    await User.update({ role: 'ADMIN' }, { where: { email: 'admin@test.com' } });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    
    adminToken = res.body.token;
  });

  after(async () => {
    await sequelize.close();
  });

  describe('Auth API', () => {
    it('register USER', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'user@test.com', password: 'password123', role: 'USER' });
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
    });

    it('login USER', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'password123' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      userToken = res.body.token;
    });

    it('register EMPLOYER', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'employer@test.com', password: 'password123', role: 'EMPLOYER' });
      expect(res.status).to.equal(201);
    });

    it('login EMPLOYER', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'employer@test.com', password: 'password123' });
      expect(res.status).to.equal(200);
      employerToken = res.body.token;
    });
  });

  describe('Category API', () => {
    it('create category ADMIN', async () => {
      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'IT & Software' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      categoryId = res.body.id;
    });

    it('get categories', async () => {
      const res = await request(app)
        .get('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe('Jobs API', () => {
    it('create job EMPLOYER', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Astana',
          salary: '500000 KZT',
          description: 'React developer needed',
          categoryId: categoryId
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      jobId = res.body.id;
    });

it('get all jobs', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('totalItems');
      expect(res.body).to.have.property('totalPages');
    });
  });

  describe('Profile API', () => {
    it('get current user profile', async () => {
      const res = await request(app)
        .get('/api/profile/me')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('email', 'user@test.com');
    });
  });

  describe('Admin API', () => {
    it('get stats ADMIN', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('cards');
    });

    it('delete job ADMIN', async () => {
      const res = await request(app)
        .delete(`/api/admin/jobs/${jobId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
    });
  });
});