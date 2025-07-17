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
*Note the app summary is above in this read me. Simpyl scroll up to the top of this page to see it.

#### Standard Goals Completed
- _Allow users with an account to write, edit, and delete reviews for books._ – Completed. User can edit and delete reviews on each book page. The review is saved to the database accordingly. 
- _Implement a reading recommendation system (possibly content-based filtering and/or user profile-based filtering). If the user has an account, book recommendations are given using a recommendation system based on the user’s past reviews and/or user profile._ – Completed.
- _Implement standard cybersecurity practices eg. HTTPS connection, database encryption, sanitizing database inputs, etc. Will refer to OWASP resources._ – Completed. Refer to the section "XSS Security Assessment" below. 
- _Basic reading list functionality. Add/remove books from personal reading list._ – Completed. User can remove books from their wishlist on the /profile page. They can add books as they browse by clicking the heart button on the corner of a book card


#### Stretch Goals 
- _The user’s rich-text input is analyzed using natural language processing (NLP), to identify semantic similarities between keywords in the user’s input and book descriptions._ – Completed. We now have a page for making NLP recommendations, /nlpsearch.
- All other stretch goals dropped for M4 due to time constraints.

#### Non-trivial elements

| Element                       | Stage of Completion |
| ----------------------------- | ------------------- |
| Hybrid Recommendation System  | Completed           |
| Semantic NLP Search Engine    | Completed           |

- **Hybrid Recommendation System:** The main Node.js backend acts as an orchestrator, querying a dedicated Python-based Recommender Service for personalized suggestions. The system makes recommendations using Collaborative Filtering, analyzing the user's past interactions (book ratings) and comparing them to the behavior of similar users to predict which books the user might enjoy next. It uses a user-item matrix to map user preferences against book items and is cached in Redis for performance. We also implemented fallback strategies to ensure recommendations are always available:
   - If the primary model doesn't yield enough results, the system suggests books from the user's **favorite genres**.
   - If the user has no favorite genres, the app recommends the **most popular books** on the platform.

- **Semantic NLP Search Engine:** We use the `sentence-transformers` library with the pre-trained `all-MiniLM-L6-v2` model to understand the *semantic meaning* of text, not just keywords. We use **vector embedding** so that the titles and descriptions of all books are converted into numerical vectors (embeddings) and stored in our MongoDB database. When a user enters a search query, it's also converted into a vector using this model. The system then uses **cosine similarity** to compare the user's query vector against every book vector in the database. This calculates the "conceptual distance" between the query and each book. Books are ranked based on their similarity score, allowing users to find relevant books even if their search terms don't exactly match the title or description. The similarity score (a value from 0.0 to 1.0) is also converted into the **percentage match** displayed in the UI, giving users immediate and quantifiable feedback on the relevance of each result.

#### XSS Security Assessment
placeholder text placeholder textplaceholder textplaceholder textplaceholder textplaceholder text

#### M4 Highlights
Key UX changes since M3 include:

- **Launched Semantic NLP Search:** The largest new feature is our powerful semantic search engine. Users can now search for books using natural language queries. The backend service uses a `sentence-transformers` model to understand the meaning behind the query and returns results based on conceptual relevance, not just keyword matching.
Users can further make advanced filtered searched in their semantic search results by specifying a **genre** or a **publication year range**, allowing for highly specific and relevant discovery.

- **Implemented UI Loading States:** We implemented loading state indicators (spinners) across the application. This provides clear visual feedback to the user, letting them know that content is being loaded in the background.

- **Added Dynamic Content Loading (Pagination):** To improve performance and maintain a snappy user experience, we added pagination to the reviews section on the Book Details page. Here, only the first three user reviews are loaded initially. A "Look at more reviews..." button was added to allow users to progressively load more reviews on demand. We did the same with book gallery component, preventing long initial load times on pages with extensive content that previously made our app lag heavily.

- **Enhanced Responsive and Adaptive UI:** We significantly improved the responsive design of the Book Details page. We refined the two-column layout to gracefully stack into a single, centered column on smaller devices, ensuring readability and a consistent user experience across desktop and mobile.

- **Implemented Intuitive User Input Validation:** To improve the quality of user-submitted content and prevent errors, we added client-side validation to the review submission form. The "Submit Review" button is now disabled until the user has provided either a star rating or written some text. This was achieved by dynamically updating the button's state based on user input and styling it with reduced opacity to provide clear visual feedback.

- **Changed Default Navigation:** Based on user flow analysis, we changed the primary navigation link on the site logo to direct users to the `/search` page instead of the login page, establishing the search page as the main hub for authenticated users.

