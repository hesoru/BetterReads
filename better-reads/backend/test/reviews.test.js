import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';
import Books from '../model/books.js';
import Users   from '../model/users.js';
import Reviews from '../model/reviews.js';
import "./setup.js";


let testUser1 = {
    username:       "User1",
    password:       'Password1',
    favoriteGenres: ['Genre1'],
    join_time:      new Date(),
    reviews:        [],
    wishList:       [],
}

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

describe('Reivew Tests', () => {
    let user1
    let book1
    let book2
    let review1
    let review2

    beforeEach(async () => {
        user1 = await Users.create(testUser1);
        book1 = await Books.create(testBook1);
        book2 = await Books.create(testBook2);
        review1 =  await Reviews.create({
            userId: user1.username,
            bookId: book1._id,
            title: 'This is a great book',
            date: new Date(),
            rating: 4,
            description: "I love this book"
        });
    });

    it('returns all reviews written by the specified user (User1)', async () => {
        const res = await request(app).get(`/reviews/user/${user1.username}`).expect(200);
        expect(res.body).to.be.an('array').with.lengthOf(1);
        const ratings = res.body.map((r) => r.rating);
        expect(ratings).to.deep.equal([4]);
    });

    it('updates rating & description and returns the updated doc', async () => {
        const res = await request(app)
            .put(`/reviews/${review1._id}`)
            .send({ rating: 5, description: 'Edited text' })
            .expect(200);

        expect(res.body).to.have.property('_id', review1._id.toString());
        expect(res.body).to.include({ rating: 5, description: 'Edited text' });
    });

    it('returns 404 when the review does not exist', async () => {
        const nonexistentId = new mongoose.Types.ObjectId();
        await request(app)
            .put(`/reviews/${nonexistentId}`)
            .send({ rating: 4 })
            .expect(404);
    });

    it('deletes a review', async () => {
        //const review = await request(app).get(`/reviews/`)
        const { status, body } = await request(app).delete(`/reviews/${review1._id}`)
        expect(status).to.be.equals(200)
        const stillExists = await Reviews.findById(review1._id);
        expect(stillExists).to.be.null;
    });

    it('returns 404 for an unknown reviewId', async () => {
        const badId = new mongoose.Types.ObjectId();
        const { status, body } = await request(app).delete(`/reviews/${badId}`);
        expect(status).to.be.equals(404)
        expect(body.error).to.be.equals('Review not found');
    });

    it('returns the single review left by the user on the book', async () => {
        const res = await request(app)
            .get('/reviews/user-review')
            .query({ bookId: book1._id.toString(), userId: user1.username })
            .expect(200);
        expect(res.body).to.have.property('_id', review1._id.toString());
        expect(res.body).to.include({
            userId: user1.username,
            bookId: book1._id.toString(),
            title: 'This is a great book',
            rating: 4,
            description: 'I love this book',
        });
    });

    it('returns null if no review exists for book', async () => {
        const res = await request(app)
            .get('/reviews/user-review')
            .query({
                bookId: book2._id.toString(),
                userId: user1.username
            })
            .expect(200);

        expect(res.body).to.be.null;
    });

    it('review review of specific user by username', async () => {
        const res1 = await request(app).get(`/reviews/user/${user1.username}`).expect(200);
        expect(res1.body).to.be.an('array').with.lengthOf(1);
        const ratings1 = res1.body.map((r) => r.rating);
        expect(ratings1).to.deep.equal([4]);

        // add review for another book
        review2 =  await Reviews.create({
            userId: user1.username,
            bookId: book2._id,
            title: 'This is a bad book',
            date: new Date(),
            rating: 1,
            description: "I hate this book"
        });

        const res2 = await request(app).get(`/reviews/user/${user1.username}`).expect(200);
        expect(res2.body).to.be.an('array').with.lengthOf(2);
        const ratings2 = res2.body.map((r) => r.rating);
        expect(ratings2).to.deep.equal([4, 1]);
    });
    it('check for increment of bookReviewCount & userReviewCount', async () => {
        const user3 = await Users.create( {
            username:       "User3",
            password:       'Oreoluw$$$$1213',
            favoriteGenres: ['Genre1'],
            join_time:      new Date(),
            reviews:        [],
            wishList:       [],
        });
        const res2 = await request(app).get(`/reviews/user/${user3.username}`).expect(200);
        console.log("res2.body", res2.body);
        console.log("book2 Id", book2._id);
        console.log("user3 Id", user3._id);
        expect(res2.body).to.be.an('array').with.lengthOf(0);

        await Books.findById(book2._id).then(book => {
            console.log("book2 before", book);
            expect(book.reviewCount).to.equal(2);});
        // add review for another book
        review2 = await request(app).post(`/books/${book2._id}/reviews`).send({
            username: user3.username,
            rating: 1,
            description: "I hate this book"
        });

        const res3 = await request(app).get(`/reviews/user/${user3.username}`).expect(200);
        console.log("user3 reviews", res3.body);
        const userReviewID = res3.body[0]._id;
        console.log("userReviewID", userReviewID);

        expect(res3.body).to.be.an('array').with.lengthOf(1);
        const addedReview = await Reviews.findById(userReviewID);
        console.log("addedReview", addedReview);
        await Books.findById(book2._id).then(book => {
            console.log("book after review addition", book);
            expect(book.reviewCount).to.equal(3);});
        const ratings2 = res3.body.map((r) => r.rating);
        expect(ratings2).to.deep.equal([1]);
    });
});