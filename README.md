# BetterReads
### Reading is good for you, but we can make it *better*.

**Team 25 - Datababes**

**Team members:** Oreoluwa Akinwunmi, Renbo Xu, Helena Sokolovska, and Marvel Hariadi

## App Summary
Our application is an intelligent, social book discovery platform tailored to passionate readers who want a more engaging and personalized experience than traditional apps like Goodreads. It allows users to explore and write reviews for books; receive personalized reading recommendations; and curate reading wishlists. By storing book metadata, user preferences, and behavioral insights, the platform delivers a highly individualized user experience. Built on MongoDB, it features account management, a natural language processing (NLP)–powered search engine, a reading recommendation system, and interactive user features.

## Instruction for Running the App with Docker

Clone the repository and run with Docker Compose. In your bash terminal, run:

```bash
# After downloading our app, ensure you are under TEAM25_BETTERREADS to run the following command
docker-compose up -d --build  # start container
docker-compose down        # tear down container
```

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Recommender API**: http://localhost:5001

## Environment Variables

The Docker Compose files include default environment variables. For custom configurations, create a `.env` file in the project root directory.

Example `.env` file:
```
MONGO_URI=mongodb://root:rootpassword@mongodb:27017/betterreads?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
JWT_SECRET=your_custom_jwt_secret
```

## Milestones

### Milestone 1:
The following frontend features have been implemented:
- Book product card component
- Book gallery component (carousel of many book cards)
- Book review card component
- User profile component
- Header component with navigation links
- Login and signup page
- Book search page
- Book details page
- User profile page

### Milestone 2:
The following features have been implemented for Milestone 2:
#### Database
1. Designed the relational schema for `Books`, `Reviews`, and `Users`, and created corresponding backend models.
2. Established a MongoDB connection and initialized the project database (`booksdb`) with the necessary collections: `books`, `reviews`, and `users`.
3. Populated the database with sample data: 3625 books, 7 reviews, and 7 users.

#### Backend
1. Configured routing and implemented the majority of the required API endpoints.
2. Developed key application functionalities:
   - **Sign-In & Registration Page**: Implemented sign-in and sign-up functionality, including support for guest access.
   - **User Profile Page**: Implement functions for user profile page that displays user information fetched from the database.
   - **Book Details Page**: Implement functions for a book details page that presents book data retrieved from the database.
   - **Review Submission**: Implement function so user can write and submit reviews for books, which will be presisted to the database.
   - **Book Search Page**: Implemented a keyword-based search feature that matches against book titles and descriptions.

### Milestone 3:
The following featuers have been implemented for Milestone 3:
- UI has been made responsive to fix some bugs.
   - Functional 'make reviews' button to autoscroll to right component.
   - Select rating when creating or editing a new review.
   - Filtering the user review from other reviews on detail page of book
   - Cleaner UI for the search page
- NLP Book search bar now has additional genre selection option.
   - Search bar allows you to search (if wanted) to allow for stricter limitation
- Fixed background images.
- Hashed and salted user passwords in the backend with bcrypt for security.
- Ability to persist wishlist from guest session when user signs up for a new account
- Added pagination for book search results.
- Implemented recommender system (external API): genre-based, collaborative filtering, and popularity-based recommendations.
- Implemented Redis caching for user-item matrix and popular books.

### Test Suite Section
1. Test folder were created including setup.js, books.test.js, reviews.tests.js and users.test.js. 
2. Test using Mocha, Chai, Supertest, Mongodb-Memory-Server. Test report is generated using mochawesome.
3. There are 39 total tests covering API calls of books.js, reviews.js and users.js
3. Instruction to run the test:
```bash
# After downloading our app, cd better-reads/backend to run the following command
npm install # install all required dependencies for testing
npm test    # run test 

# The test result report can be reviewed by opending mochawesome.html by browser. The mochawesome.html is located at better-reads/backend/mochawesome-report/mochawesome.html
```
## Accessing test suite html file instructions: 
   - The test result report can be reviewed by opending mochawesome.html by browser. The mochawesome.html is located at better-reads/backend/mochawesome-report/mochawesome.html


### Milestone 4:

#### Standard Goals 
- _Allow users with an account to write, edit, and delete reviews for books._ – Completed.
- _Implement a reading recommendation system (possibly content-based filtering and/or user profile-based filtering). If the user has an account, book recommendations are given using a recommendation system based on the user’s past reviews and/or user profile._ – Completed.
- _Implement standard cybersecurity practices eg. HTTPS connection, database encryption, sanitizing database inputs, etc. Will refer to OWASP resources._ – Completed.
- _Basic reading list functionality. Add/remove books from personal reading list._ – Completed.


#### Stretch Goals 
- _The user’s rich-text input is analyzed using natural language processing (NLP), to identify semantic similarities between keywords in the user’s input and book descriptions._ – Completed. Viewable in /nlpsearch page.
- _Ability to scrape book data and add new books to the database._ – Not started. Will impliment in final release provided there is time.
- _Users can create a non-existent book in the app and add related information._ – Not started. Will impliment in final release provided there is time. 
- _Allow users to post current reads on their profiles. Let users post or mark what they’re currently reading. Optionally timestamp or add commentary._ – In-development. This feature requires significant database and UI refactoring and is being developed on a separate branch. It will be merged into `main` upon successful completion within the project timeline.


#### Non-trivial elements

| Element                       | Stage of Completion |
| ----------------------------- | ------------------- |
| Hybrid Recommendation System  | Completed           |
| Semantic NLP Search Engine    | Completed           |


Our app features two non-trivial systems. The **Hybrid Recommendation System** uses collaborative filtering on a Python microservice to generate personalized suggestions, with genre and popularity-based fallbacks. The **Semantic NLP Search Engine** uses a `sentence-transformers` model to convert book data and user queries into vector embeddings, returning results ranked by cosine similarity.

#### XSS Security Assessment
placeholder text placeholder textplaceholder textplaceholder textplaceholder textplaceholder text

#### M4 Highlights

- **Semantic NLP Search:** Launched a semantic search engine with advanced filters for genre and publication year.
- **UI Loading States:** Added spinners to provide visual feedback during data fetching.
- **Dynamic Content Loading:** Implemented pagination for reviews and book galleries to improve load times.
- **Responsive UI & Dark Mode:** Enhanced page layouts for mobile and ensured compatibility with the Dark Reader chrome extension.
- **Input Validation:** Added client-side validation to the review submission form.
- **Editable/Deletable Reviews:** Implemented functionality for users to edit and delete their own reviews.
- **Half-Star Ratings:** Enabled backend support for half-star increments in reviews for more nuanced feedback.
- **Updated Navigation:** Rerouted the main logo to the `/search` page, making it the functional home page.
- **Add to Wishlist:** Implemented functionality for users to add books to their wishlist.
- **Genre Selection:** Modified the list of displayed genre tags in the UI to dynamically pull unique genre tags associated with all books in our database.
- **Login Error:** Fixed bug to ensure UI warning is displayed with informative message upon unsucessful login attempt and prevents navigation to search page as guest.
  
