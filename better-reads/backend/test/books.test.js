import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';
import Books from '../model/books.js';
import Users   from '../model/users.js';
import Reviews from '../model/reviews.js';
import "./setup.js";

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

const testBook2 = {
    title:            `Title2`,
    author:           'Author2',
    publishYear:      2002,
    image:            'Image2',
    description:      'Description2',
    genre: ['Genre1', 'Genre3'],
    ISBN:             '222222222',
    numberOfEditions: 2,
    averageRating:    2,
    ratingsCount:     2,
    reviewCount:      2,
};

let testUser = {
    username:       "User1",
    password:       'Password1',
    favoriteGenres: ['Genre1'],
    join_time:      new Date(),
    reviews:        [],
    wishList:       [],
}

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

describe('Books Tests', () => {
    it('GET /books returns all generated books', async () => {
        await Books.insertMany([testBook1, testBook2]);
        const { status, body } = await request(app).get('/books');
        expect(status).to.equal(200);
        expect(body).to.have.length(2);
    });

    it('searches by book title case exact match', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=Title1');
        expect(body.map(b => b.title)).to.deep.equal(['Title1']);
        expect(status).to.equal(200);
    });

    it('searches by book title case insensitive', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=title1');
        expect(body.map(b => b.title)).to.deep.equal(['Title1']);
        expect(status).to.equal(200);
    });

    it('searches by book partil title', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=title');
        expect(body.map(b => b.title)).to.deep.equal(['Title1', "Title2"]);
        expect(status).to.equal(200);
    });

    it('searches by book description', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=description2');
        expect(body.map(b => b.title)).to.deep.equal(["Title2"]);
        expect(status).to.equal(200);
    });

    it('searches by book author', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=author2');
        expect(body.map(b => b.title)).to.deep.equal(["Title2"]);
        expect(status).to.equal(200);
    });

    it('filters by multiple genres & sorts by averageRating desc', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/genres?genres=Genre1, Genre2');
        expect(body.map(b => b.title)).to.deep.equal(["Title2", "Title1"]);
        expect(status).to.equal(200);
    });

    it('searches and finds nothing (empty result)', async () => {
        await Books.create(testBook1);
        await Books.create(testBook2);
        const { status, body } = await request(app).get('/books/search?q=NoSuchBook123');
        expect(body).to.be.an('array').that.is.empty;
        expect(status).to.equal(200);
    });

    it('returns a book by ID and 404 for unknown ID', async () => {
        const created = await Books.create(testBook1);
        const ok = await request(app).get(`/books/${created._id}`);
        expect(ok.body.title).to.equal('Title1');
        const bad = await request(app).get(`/books/${new mongoose.Types.ObjectId()}`);
        expect(bad.status).to.equal(404);
    });

    it('creates, updates, lists reviews', async () => {
        const book = await Books.insertOne(testBook1);
        const user = await Users.insertOne(testUser);
        console.log("user", user);
        const currentBook = await Books.findById(book._id).lean();
        expect(currentBook.reviewCount).to.equal(1);
        await request(app)
            .post(`/books/${book._id}/reviews`)
            .send({ username: user.username, rating: 5, description: 'Great!' })
            .expect(201);

        await request(app)
            .post(`/books/${book._id}/reviews`)
            .send({ username: user.username, rating: 4 })
            .expect(200);

        const { body } = await request(app).get(`/books/${book._id}/reviews`);
        expect(body).to.have.length(1);
        expect(body[0].rating).to.equal(4);
        // TODO: update book reviewCount once the book has a new review
        const updatedBook = await Books.findById(book._id).lean();
        expect(updatedBook.reviewCount).to.equal(2);
    });

    it('adds & removes a book from user wishlist', async () => {
        const book = await Books.create(testBook1);
        const user = await Users.create(testUser);

        const add = await request(app)
            .post(`/books/${book._id}/wishlist`)
            .send({ userId: user._id });
        expect(add.body).to.include(String(book._id));

        const del = await request(app)
            .delete(`/books/${book._id}/wishlist`)
            .send({ userId: user._id });
        expect(del.body).to.not.include(String(book._id));
    });
});