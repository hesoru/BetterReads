# BetterReads
### Reading is good for you, but we can make it *better*.

**Team 25 - Datababes**

**Team members:** Oreoluwa Akinwunmi, Renbo Xu, Helena Sokolovska, and Marvel Hariadi

Our application is an intelligent, social book discovery platform tailored to passionate readers who want a more engaging and personalized experience than traditional apps like Goodreads. It allows users to explore and write reviews for books; receive personalized reading recommendations; and curate reading wishlists. By storing book metadata, user preferences, and behavioral insights, the platform delivers a highly individualized user experience. Built on MongoDB, it features account management, a natural language processing (NLP)–powered search engine, a reading recommendation system, and interactive user features.

## Instruction for Running the App with Docker

Clone the repository and run with Docker Compose. In your bash terminal, run:

```bash
# After downloading our app, ensure you are under TEAM25_BETTERREADS to run the following command
docker-compose up --build  # start container
docker-compose down        # tear down container
```

## Accessing the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Recommender API**: http://localhost:5001

## Environment Variables

The Docker Compose file is configured to use environment variables from `.env` files. For your convenience, we've included `.env.example` files in the repository that you can use as templates.

### Setting Up Environment Files

1. **Root Directory**: Copy `.env.example` to `.env` in the project root directory for Docker Compose variables:
   ```bash
   cp .env.example .env
   ```

2. **Service-Specific Environment Files**: Each service has its own environment file:
   ```bash
   # Backend service
   cp backend/.env.example backend/.env
   
   # Recommender service
   cp recommender/.env.example recommender/.env
   
   # Frontend service
   cp frontend/.env.example frontend/.env
   ```

3. **Environment Variables in Docker**: When running with Docker Compose, the environment variables are loaded from:
   - The root `.env` file (for Docker Compose variables)
   - Service-specific `.env` files (for each service)
   - Environment variables defined directly in the `docker-compose.yml` file

### Example Root `.env` File
```
# MongoDB Configuration
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=rootpassword
MONGO_DATABASE=betterreads
MONGO_URI=mongodb://root:rootpassword@mongodb:27017/betterreads?authSource=admin

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Server Configuration
BACKEND_PORT=3000
RECOMMENDER_PORT=5001
FRONTEND_PORT=80
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
- UI has been made responsive. 
- NLP Book search bar now has additional genre selection option.
- Fixed background images. 
- Added pagination for book search results.
- Implemented recommender system (external API): genre-based, collaborative filtering, and popularity-based recommendations.
- Implemented Redis caching for user-item matrix and popular books.

### TEST section
1. Test folder were created including setup.js, books.test.js, reviews.tests.js and users.test.js. 
2. Test using Mocha, Chai, Supertest, Mongodb-Memory-Server. Test report is generated using mochawesome.
3. There are 34 total tests covering API calls of books.js, reviews.js and users.js
3. Instruction to run the test:
```bash
# After downloading our app, cd better-reads/backend to run the following command
npm install # install all required dependencies for testing
npm test    # run test 

# The test result report can be reviewed by opending mochawesome.html by browser. The mochawesome.html is located at better-reads/backend/mochawesome-report/mochawesome.html
```