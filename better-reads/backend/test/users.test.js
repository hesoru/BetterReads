import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';
import Books from '../model/books.js';
import Users   from '../model/users.js';
import Reviews from '../model/reviews.js';
import "./setup.js"
import bcrypt from 'bcrypt';

const testBook1 = {
    title:            `Title1`,
    author:           'Author1',
    publishYear:      2001,
    image:            'Image1',
    description:      'Description1',
    genre: ['Genre1', 'Genre2'],
    ISBN:             '111111111',
    numberOfEditions: 1,
    averageRating:    1,
    ratingsCount:     1,
    reviewCount:      1,
};

let testUser1 = {
    username:       "User1",
    password:       'Password1@321234567890',
    favoriteGenres: ['Genre1'],
    join_time:      new Date(),
    reviews:        [],
    wishList:       [],
}

let testUser2 = {
    username:       "User2",
    password:       'Password2',
    favoriteGenres: ['Genre2'],
    join_time:      new Date(),
    reviews:        [],
    wishList:       [],
}

const defaultAvatar =
    '../../src/images/icons/User_Profile_Image_NoLogo.png';

// let mongo;

// before(async () => {
//   process.env.NODE_ENV = 'test'; //this is important to ensure not run on production database
//   mongo = await MongoMemoryServer.create();
//   await mongoose.connect(mongo.getUri());
//   console.log("mongo.getUri()", mongo.getUri())
// });

// after(async () => {
//   await mongoose.disconnect();
//   await mongo.stop();
// });

// beforeEach(async () => {
//   const { host, port } = mongoose.connection;
//   const expectedHost = mongo.instanceInfo.ip;
//   const expectedPort = mongo.instanceInfo.port;

//   if (
//     process.env.NODE_ENV !== 'test' ||
//     host !== expectedHost ||
//     port !== expectedPort
//   ) {
//     throw new Error(
//       `Refusing to run deleteMany — connected to ${host}:${port}, expected ${expectedHost}:${expectedPort}`
//     );
//   }

//   const collections = await mongoose.connection.db.collections();
//   for (const coll of collections) {
//     await coll.deleteMany();
//   }
// });

describe('Users Tests', () => {
    it('GET /users returns all new users', async () => {
        await Users.create([testUser1, testUser2]);
        const { status, body } = await request(app).get('/users');
        expect(status).to.equal(200);
        expect(body).to.have.length(2);
    });

    it('Retrieve UserImageURL by username', async () => {
        await Users.create([testUser1, testUser2]);
        const { status, body } = await request(app).get('/users/avatarUrl/User2');
        expect(status).to.equal(200);
        expect(body).to.equal(defaultAvatar);
    })

    it('returns a user by ID or 404 for unknown ID', async () => {
        const created = await Users.create(testUser1);
        const ok = await request(app).get(`/users/${created._id}`);
        expect(ok.body.username).to.equal('User1');
        const bad = await request(app).get(`/users/${new mongoose.Types.ObjectId()}`);
        expect(bad.status).to.equal(404);
    })

    it('returns a user by username or 404 for unknown username', async () => {
        const created = await Users.create(testUser1);
        const ok = await request(app).get(`/users/get-user/${testUser1.username}`);
        expect(ok.body.username).to.equal('User1');
        const bad = await request(app).get("/users/get-user/unknown-user");
        expect(bad.status).to.equal(404);
    })
});

describe('POST /signup', () => {
    it('creates a new user with valid password requirements', async () => {
        const res = await request(app)
            .post('/users/signup')
            .send({
                username: 'charlie',
                password: 'San8erseeeqer@001',
                avatarUrl: 'https://picsum.photos/200',
                favoriteGenres: ['Fantasy', 'Sci‑Fi'],
                join_time:      new Date(),
                reviews:        [],
                wishList:       [],
            });

        expect(res.status).to.equal(201);

        const userInDb = await Users.findOne({ username: 'charlie' });
        expect(userInDb).to.exist;
        expect(userInDb.avatarUrl).to.equal('https://picsum.photos/200');
        expect(userInDb.favoriteGenres).to.include('Fantasy');
    });

    it('rejects users who fail password requirements', async () => {
        const res = await request(app)
            .post('/users/signup')
            .send({
                username: 'charlie',
                password: 'bad password',
                avatarUrl: 'https://picsum.photos/200',
                favoriteGenres: ['Fantasy', 'Sci‑Fi'],
                join_time:      new Date(),
                reviews:        [],
                wishList:       [],
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equals("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol.");
    });

    it('rejects duplicate usernames', async () => {
        await Users.create({ username: 'charlie', password: 'another123^A21212', join_time: new Date()});

        const res = await request(app)
            .post('/users/signup')
            .send({ username: 'charlie', password: 'another123^A212121231', favoriteGenres: [] });
        expect(res.status).to.equal(409);
        expect(res.body.error).to.equals('Username already exists');
    });
});

describe('POST /login', () => {
    beforeEach(async () => {
        const password = 'Password1?321234567890';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashedPassword);
        await Users.create({
            username:       "User123",
            password:       hashedPassword,
            join_time:      new Date(),
        });
    });

    it('logs in with correct credentials', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'User123', password: 'Password1?321234567890' });

        expect(res.status).to.equal(200);
        expect(res.body.user.username).to.equal('User123');
    });

    it('rejects invalid password', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'User123', password: 'wrong' });

        expect(res.status).to.equal(401);
        expect(res.body.error).to.equals('Invalid username or password');
    });

    it('rejects invalid username', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'unknown', password: 'Password1?321234567890'});

        expect(res.status).to.equal(401);
        expect(res.body.error).to.equals('This username does not exist. Please make sure username is correct and try again.');
    });
});

describe('PUT /:id/genres/add-multiple', () => {
    let user;

    beforeEach(async () => {
        user = await Users.create(testUser1);
    });

    it('adds new genres without duplicates', async () => {
        const res = await request(app)
            .put(`/users/${user._id}/genres/add-multiple`)
            .send({ genres: ['Mystery', 'Drama'] });

        expect(res.status).to.equal(200);
        expect(res.body.favoriteGenres).to.include.members(["Genre1", 'Drama', 'Mystery']);
        expect(res.body.favoriteGenres).to.have.length(3);
    });

    it('adds new genres to unknown users', async () => {
        const res = await request(app)
            .put(`/users/${new mongoose.Types.ObjectId()}/genres/add-multiple`)
            .send({ genres: ['Mystery', 'Drama'] });

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equals('User not found');
    });
});

describe('PUT /:id', () => {
    it('updates a use information', async () => {
        const user = await Users.create(testUser1);
        expect(user.avatarUrl).to.equal(defaultAvatar);

        const res = await request(app)
            .put(`/users/${user._id}`)
            .send({ avatarUrl: 'different_pic_url' });

        expect(res.status).to.equal(200);
        expect(res.body.avatarUrl).to.equal('different_pic_url');
    });
});

describe('PATCH /update-wishlist/:id', () => {
    let user;
    let testBook

    beforeEach(async () => {
        user = await Users.create(testUser1);
        testBook = await Books.create(testBook1);
    });

    it('adds a book to the wishlist and remove it later', async () => {
        const res1 = await request(app)
            .patch(`/users/update-wishlist/${user._id}`)
            .send({ bookId: testBook._id, operation: 'add' });

        expect(res1.status).to.equal(200);
        expect(res1.body.wishList[0]).to.equal(String(testBook._id));

        const res2 = await request(app)
            .patch(`/users/update-wishlist/${user._id}`)
            .send({ bookId: testBook._id, operation: 'remove' });

        expect(res2.status).to.equal(200);
        expect(res2.body.wishList).to.not.include(String(testBook._id));
    });
});

describe('DELETE /:id', () => {
    it('deletes an existing user', async () => {
        const user = await Users.create(testUser1);

        const res = await request(app).delete(`/users/${user._id}`);
        expect(res.status).to.equal(204);

        const stillThere = await Users.findById(user._id);
        expect(stillThere).to.be.null;
    });

    it('returns 404 when deleting an unknown user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/users/${fakeId}`);
        expect(res.status).to.equal(404);
    });
});