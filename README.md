# BetterReads
### Reading is good for you, but we can make it *better*.

**Team 25 - Datababes**

**Team members:** Oreoluwa Akinwunmi, Renbo Xu, Helena Sokolovska, and Marvel Hariadi

Our application is an intelligent, social book discovery platform tailored to passionate readers who want a more engaging and personalized experience than traditional apps like Goodreads. It allows users to explore and write reviews for books; receive personalized reading recommendations; and curate reading wishlists. By storing book metadata, user preferences, and behavioral insights, the platform delivers a highly individualized user experience. Built on MongoDB, it features account management, a natural language processing (NLP)–powered search engine, a reading recommendation system, and interactive user features.

## Setup

Clone the repository and run with Docker Compose. In your bash terminal, run:

```bash
git clone -b Milestone1 https://github.students.cs.ubc.ca/CPSC455-2025S/Team25_BetterReads.git
cd Team25_BetterReads
docker-compose up --build  # start container
docker-compose down        # tear down container
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
