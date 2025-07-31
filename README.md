# BetterReads
### Reading is good for you, but we can make it *better*.

### Datababes (Team 25)

**Team members:** Oreoluwa Akinwunmi, Renbo Xu, Helena Sokolovska, and Marvel Hariadi

## App Summary
Our application is an intelligent, social book discovery platform tailored to passionate readers who want a more engaging and personalized experience than traditional apps like Goodreads. It allows users to explore and write reviews for books; receive personalized reading recommendations; and curate reading wishlists. By storing book metadata, user preferences, and behavioral insights, the platform delivers a highly individualized user experience. Built on MongoDB, it features account management, a natural language processing (NLP)–powered search engine, a reading recommendation system, and interactive user features.

## Instructions for Running the App with Docker

Clone the repository and run with Docker Compose. In your bash terminal, run:

```bash
# After downloading our app, ensure you are under TEAM25_BETTERREADS to run the following command
docker-compose up -d --build  # start container
docker-compose down           # tear down container
```

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Recommender API**: http://localhost:5001
- **NLP Search API**: http://localhost:5002s
- **Redis**: http://localhost:6379
- **MongoDB**: http://localhost:27017

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
The following features have been implemented this milestone:

#### Frontend
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
The following features have been implemented this milestone:

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
The following features have been implemented this milestone:

#### Frontend
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
- A test folder was created including setup.js, books.test.js, reviews.tests.js and users.test.js. 
- Tests were written using Mocha, Chai, Supertest, Mongodb-Memory-Server. Test report is generated using mochawesome.
- There are 39 total tests covering API calls of books.js, reviews.js and users.js

#### Instructions to run the test:

```bash
# After downloading our app, cd better-reads/backend to run the following command
npm install # install all required dependencies for testing
npm test    # run test 

# The test result report can be reviewed by opending mochawesome.html by browser. The mochawesome.html is located at better-reads/backend/mochawesome-report/mochawesome.html
```
The test report can be reviewed by opening mochawesome.html by browser. The mochawesome.html is located in `better-reads/backend/mochawesome-report/`.

### Milestone 4:

#### Standard Goals 
- _Allow users with an account to write, edit, and delete reviews for books._ – Completed.
- _Implement a reading recommendation system (possibly content-based filtering and/or user profile-based filtering). If the user has an account, book recommendations are given using a recommendation system based on the user’s past reviews and/or user profile._ – Completed.
- _Implement standard cybersecurity practices eg. HTTPS connection, database encryption, sanitizing database inputs, etc. Will refer to OWASP resources._ – Completed.
- _Basic reading list functionality. Add/remove books from personal reading list._ – Completed.


#### Stretch Goals 
- _The user’s rich-text input is analyzed using natural language processing (NLP), to identify semantic similarities between keywords in the user’s input and book descriptions._ – **Completed**. Viewable in /nlpsearch page.
- _Summarize book reviews. Possibly identify if the user’s overall sentiment on a specific book is positive or negative & possibly find common themes among reviews for a book (ie. clustering)._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Ability to scrape book data and add new books to the database._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Users can create a non-existent book in the app and add related information._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Allow users to post current reads on their profiles. Let users post or mark what they’re currently reading. Optionally timestamp or add commentary._ – **In-development**. This feature requires significant database and UI refactoring and is being developed on a separate branch. It will be merged into `main` upon successful completion within the project timeline. 


#### Non-trivial elements

| Element                       | Stage of Completion |
| ----------------------------- | ------------------- |
| Book Recommendation System  | Completed           |
| Semantic NLP Search Engine    | Completed           |


Our app features two non-trivial systems. The **Hybrid Recommendation System** uses collaborative filtering on a Python microservice to generate personalized suggestions, with genre and popularity-based fallbacks. The **Semantic NLP Search Engine** processes book metadata (titles and descriptions) through the Sentence-transformers library using the 'all-MiniLM-L6-v2' model to create vector embeddings. These embeddings are indexed in our database, allowing users to perform semantic searches where query results are ranked by cosine similarity to find the most contextually relevant books.

#### M4 Updates

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
- **User Password Change:** Users now have functionality to change their passwords.

## XSS Security Assessment

### Potential XSS Entry Points

**Authentication Forms**
- **Login Form:** username and password fields
- **Signup Form:** username, password, and genre selection fields
- **Change Password Form:** old password and new password fields

**Search Pages (Regular and NLP Search)**
- **Search Bar:** search query input field
- **Genre/Year Filters:** genre/year selection dropdown

**Book Reviews**
- **User Reviews:** review text submission
- **Review Display:** how user reviews are displayed

### Methods

1. Static code analysis
2. OWASP ZAP for automated scanning (see [full report](security_assessment/2025-07-18-M4-ZAP-Report/2025-07-18-M4-ZAP-Report.html))
3. Manual testing with XSS payloads, using browser developer tools to monitor execution (see **Penetration Testing** section below)

### Assessment Focus

- Input validation and sanitization
- Output encoding
- Content Security Policy implementation
- Use of dangerous React patterns (like `dangerouslySetInnerHTML`)
- DOM-based XSS vulnerabilities

### Penetration Testing

See our [script](security_assessment/xss-test-payloads.md) for the payloads we used to test for XSS vulnerabilities, and the results of our penetration testing.

### Risk Report

### High Risk

**Unsanitized User Input in Frontend**
- **Files to Patch:** `Login.jsx`, `Signup.jsx`, `ChangePasswordPage.jsx`, `SearchPage.jsx`, `NLPSearch.jsx`, book data and reviews in `BookDetailsPage.jsx`, `bookReview.jsx`, `UserCard.jsx` rendering, `GenreSelection.jsx` rendering, and `YearSelection.jsx` rendering.
- **Issue:** Keyword input from text fields is directly passed to the backend and rendered without sanitization. An attacker could inject malicious scripts that might be stored or reflected back to users.
- **Patch:** Sanitized user inputs in affected pages using `DOMPurify`.

### Medium Risk

**Lack of Input Validation and Sanitization in Backend Routes**
- **Files to Patch:** `nlptextsearch.js`, `books.js`, `reviews.js`, and `users.js`.
- **Issue:** Backend routes for user management and reviews lack proper input validation and sanitization, potentially allowing malicious content to be stored in the database.
- **Patch:** Sanitized HTML and validated request parameters match existing models (books, reviews, users) using `sanitize-html` and `express-validator` (respectively).

**Missing Content Security Policy (CSP)**
- **File to Patch:** `index.js` (backend).
- **Issue:** Without a CSP, the application is more vulnerable to XSS attacks as there are no restrictions on which scripts can be executed in the context of the application.
- **Patch:** Implemented enforcement of the Same Origin Policy using `Helmet` middleware.

**Cross-Domain Misconfiguration**
- **File to Patch:** `index.js` (backend).
- **Issue:** The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. 
- **Patch:** Configured CORS to allow a more restrictive set of domains in the HTTP headers.

**Hidden Files Accessible**
- **File to Patch:** `index.js` (backend).
- **Issue:** The frontend is served by Vite's server during development, which automatically serves `index.html` as the default file for all routes. During deployment, routes not explicitly configured are not protected, and hidden files (eg. git files) may be accessed.
- **Patch:** Created a “catchall” handler in Express: undeclared routes throw a 404 error.

**Missing Anti-clickjacking Header**
- **File to Patch:** `index.js` (backend).
- **Issue:** Modern browsers support the `Content-Security-Policy` and `X-Frame-Options` HTTP headers, and one of them must be set on all web pages returned by the app.
- **Patch:** Set the `X-Frame-Options` header and the CSP `frame-ancestors` directive in the Helmet configuration to protect against clickjacking.

### Low Risk

**Server Leaks Information via "X-Powered-By" HTTP Response Header**
- **File to Patch:** `index.js` (backend).
- **Issue:** `X-Powered-By` header reveals that application is powered by Express, which reveals technology stack.
- **Patch:** Disabled `X-Powered-By` headers in Express to prevent information leaks.

**Absence of XSS Protection Headers**
- **File to Patch:** `index.js` (backend).
- **Issue:** The application does not set security headers like `X-XSS-Protection` and `X-Content-Type-Options` which can provide additional protection against XSS attacks and MIME-type sniffing vulnerabilities.
- **Patch:** Added the `X-XSS-Protection` and `X-Content-Type-Options` security headers to the Helmet configuration.

### Milestone 5:

### Demo

#### Key features

1. The book detail page displays comprehensive information about the selected book, including its title, description, genre, and more. It also lists all reviews related to the book. Users have the ability to write a new review or delete their existing review for the book.
<img src="img/book_detail.png" alt="book_detail" style="width:500px;"/>

2. The book search page allows users to search for books using keywords and filter results by genre. Users can click on an individual book to navigate to its detail page. Additionally, users can click the heart icon to add a book to their wishlist.
<img src="img/book_search.png" alt="book_search" style="width:500px;"/>

3. The user profile page displays the user's information and their wishlist. Users can also update their password directly from this page.
<img src="img/user_profile.png" alt="user_profile" style="width:500px;"/>

4. The book recommendation page displays personalized book recommendations for users based on their previous ratings.
<img src="img/book_recommendation.png" alt="book_recommendation" style="width:500px;"/>

5. The AI Match feature allows users to enter a text query, select a publication year, and choose a book genre. The system first filters books based on the selected genre and year, then uses Natural Language Processing (NLP) to compute the semantic similarity between the user's input and each book’s description. The matched books are then returned, ranked by similarity score from highest to lowest.

<img src="img/AI_Match.png" alt="ai_match" style="width:500px;"/>

### Goals Update
#### Minimal Goals
- _Persist user and book data to a database._ - Completed.
- _Search for books based on keyword matching and genre filtering._ - Completed.
- _User account creation and login functionality._ - Completed.
- _Select a book to read its detailed information._ - Completed.

#### Standard Goals
- _Allow users with an account to write, edit, and delete reviews for books._ – Completed.
- _Implement a reading recommendation system (possibly content-based filtering and/or user profile-based filtering). If the user has an account, book recommendations are given using a recommendation system based on the user’s past reviews and/or user profile._ – Completed.
- _Implement standard cybersecurity practices eg. HTTPS connection, database encryption, sanitizing database inputs, etc. Will refer to OWASP resources._ – Completed.
- _Basic reading list functionality. Add/remove books from personal reading list._ – Completed.


#### Stretch Goals
- _The user’s rich-text input is analyzed using natural language processing (NLP), to identify semantic similarities between keywords in the user’s input and book descriptions._ – **Completed**. Viewable in /nlpsearch page.
- _Summarize book reviews. Possibly identify if the user’s overall sentiment on a specific book is positive or negative & possibly find common themes among reviews for a book (ie. clustering)._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Ability to scrape book data and add new books to the database._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Users can create a non-existent book in the app and add related information._ – **Dropped**. We don't have enough time to impliment this feature before deadline.
- _Allow users to post current reads on their profiles. Let users post or mark what they’re currently reading. Optionally timestamp or add commentary._ – **Dropped**. This feature requires substantial refactoring of both the database and UI. We recently discovered that implementing it would be more time-consuming than initially anticipated. Given that we have already achieved one of our stretch goals, we’ve decided to drop this additional stretch feature in order to better prepare for the final demo. 


#### Non-trivial elements

| Element                       | Stage of Completion |
| ----------------------------- | ------------------- |
| Book Recommendation System  | Completed           |
| Semantic NLP Search Engine    | Completed           |


Our app features two non-trivial systems. The **Hybrid Recommendation System** uses collaborative filtering on a Python microservice to generate personalized suggestions, with genre and popularity-based fallbacks. The **Semantic NLP Search Engine** processes book metadata (titles and descriptions) through the Sentence-transformers library using the 'all-MiniLM-L6-v2' model to create vector embeddings. These embeddings are indexed in our database, allowing users to perform semantic searches where query results are ranked by cosine similarity to find the most contextually relevant books.

#### M5 highlights
- We have refined our recommendation system to give user more accurate book recommendation.

- Initially, we planned to implement an additional stretch feature that would allow users to post their current reads on their profiles. We considered pursuing this goal for Milestone 5 since we had already completed all the required features and one stretch goal at Milestone 4. However, after further evaluation, we realized that implementing this feature would be more time-consuming and complex than we had anticipated. Given our focus on delivering a polished final product and preparing for the final demo, we have decided to drop this stretch goal.
 