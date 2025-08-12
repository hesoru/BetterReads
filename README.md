# BetterReads
### Reading is good for you, but we can make it *better*.

Our application is an intelligent, social book discovery platform tailored to passionate readers who want a more engaging and personalized experience than traditional apps like Goodreads. It allows users to explore and write reviews for books; receive personalized reading recommendations; and curate reading wishlists. By storing book metadata, user preferences, and behavioral insights, the platform delivers a highly individualized user experience. Built on MongoDB, it features account management, a natural language processing (NLP)–powered search engine, a reading recommendation system, and interactive user features.

### Datababes (Team 25)

**Team members:** Oreoluwa Akinwunmi, Renbo Xu, Helena Sokolovska, and Marvel Hariadi

## Setup Instructions

Clone the repository and run with Docker Compose. In your bash terminal, run:

```bash
docker-compose up -d --build  # start container
docker-compose down           # tear down container
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Recommender API**: http://localhost:5001
- **NLP Search API**: http://localhost:5002
- **Redis**: http://localhost:6379
- **MongoDB**: http://localhost:27017

### Environment Variables

The Docker Compose files include default environment variables. For production or custom configurations, create a `.env` file in the project root directory.

Copy `.env.example` to `.env` and configure your values:
```bash
cp .env.example .env
```

Example `.env` file:
```
# For local development (uses Docker MongoDB)
MONGODB_URI=mongodb://mongodb:27017/betterreads

# For production (MongoDB Atlas)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

## Demo

### Key features

1. The **Book Details page** displays comprehensive information about the selected book, including its title, description, genres, ISBN and more. It also lists all reviews related to the book. Users have the ability to write a new, review or delete and edit their existing review.
<img src="img/book_detail.png" alt="book_detail" style="width:800px;"/>

2. The **Book Search page** allows users to search for books using keywords and filter their results by genre. Users can click on an individual book card to navigate to its detail page. Additionally, users can click on the heart icon to add the book to their wishlist.
<img src="img/book_search.png" alt="book_search" style="width:800px;"/>

3. The **User Profile page** displays the user's information and the books in their wishlist. Users can also update their password directly from this page. If the user is not signed up, then the page is defaulted to a guest profile, which also displays the booklist of their guest session with the option to sign up and persist the booklist from their guest session into the wishlist of the created user account.
<img src="img/user_profile.png" alt="user_profile" style="width:800px;"/>

4. The **Book Recommendation page** displays book recommendations for users based on their previous review ratings. By default, if the user is new without any reviews, the recomendations are displayed based on their favorite genres selected upon signup. If the user is not signed up, the recommendations displayed are based on book popularity by default.
<img src="img/book_recommendation.png" alt="book_recommendation" style="width:800px;"/>

5. The **AI Match page** allows users to describe what they'd like to read in short sentences, with optional filters to narrow down candidates based on publication year ranges and genres. Books in our database are first filtered by genre/publication year if applicable, then Natural Language Processing (NLP) is used to compute the semantic similarity between the user's input and each of the filtered candidate books. Books are returned and sorted by their cosine similarity score in descending order.
<img src="img/AI_Match.png" alt="ai_match" style="width:800px;"/>

## Features

### **Microservices Architecture**
BetterReads is built using a containerized microservices architecture with Docker Compose, featuring:
- **Frontend Service** (React + Vite)
- **Backend API** (Node.js + Express)
- **NLP Search Engine** (Python + FastAPI)
- **Recommendation System** (Python + FastAPI)
- **Redis Cache**
- **MongoDB Database**

### **Advanced Search Capabilities**

#### **Semantic NLP Search Engine**
- **Technology**: Python FastAPI microservice with Sentence-Transformers
- **Model**: `all-MiniLM-L6-v2` for vector embeddings
- **Features**: 
  - Semantic similarity search using cosine similarity
  - Vector embeddings of book titles and descriptions
  - Advanced filtering by genre and publication year
  - Real-time query processing with contextual relevance ranking

#### **Traditional Keyword Search**
- MongoDB text indexing for fast keyword matching
- Multi-field search across titles, authors, and descriptions
- Pagination and sorting capabilities

### **Intelligent Recommendation System**

#### **Book Recommendation Engine**
- **Collaborative Filtering**: LightFM model for personalized recommendations based on user ratings
- **Genre-Based and Popularity-Based Fallback**: Favourite genres and popular books recommended to new users
- **Redis Caching**: Optimized performance with cached user-item matrix

### **Security & Authentication**

#### **Comprehensive Security Implementation**
- **JWT Authentication**: Secure token-based user sessions
- **Password Security**: bcrypt hashing and salting
- **Input Sanitization**: DOMPurify for XSS prevention
- **OWASP Compliance**: Following security best practices
- **Penetration Testing**: ZAP security assessment completed

#### **Data Protection**
- Sanitized database inputs and outputs
- Secure API endpoints with authentication middleware
- Protected user data and session management

### **Database & Caching**

#### **MongoDB Database Design**
- **Collections**: Users, Books, Reviews
- **Indexing**: Optimized queries with compound indexes
- **Data Volume**: 3,625+ books with comprehensive metadata
- **Relationships**: User reviews, wishlists, and rating systems

#### **Redis Caching Strategy**
- User-item interaction matrix for recommendations
- Popular book rankings and trending data
- Session management and temporary data storage
- Performance optimization for frequent queries

### **Frontend Features**

#### **Modern React Application**
- **Framework**: React 18 with Vite build tool
- **State Management**: Redux Toolkit for global state
- **Responsive Design**: Mobile-first approach with dark mode support
- **UI Components**: Reusable component library

#### **Interactive Features**
- Real-time book search with instant results
- Dynamic review system with half-star ratings
- Wishlist management with persistent storage
- User profile customization and password management
- Pagination for large datasets

### **Development & Testing**

#### **Quality Assurance**
- **Test Suite**: 39+ comprehensive tests using Mocha, Chai, and Supertest
- **Test Coverage**: API endpoints, database operations, and user workflows
- **Automated Testing**: MongoDB Memory Server for isolated testing
- **Test Reporting**: Mochawesome HTML reports

#### **Development Tools**
- Docker containerization for consistent environments
- Hot reload development with volume mounting
- Environment configuration management
- Automated dependency management

### **Performance Optimizations**

- **Lazy Loading**: Dynamic content loading with pagination
- **Caching Strategy**: Multi-layer caching with Redis
- **Database Optimization**: Indexed queries and aggregation pipelines
- **API Efficiency**: Optimized endpoints with minimal data transfer
- **Frontend Optimization**: Code splitting and asset optimization

## Milestones

#### See milestone branches for progress reports during development of the application.