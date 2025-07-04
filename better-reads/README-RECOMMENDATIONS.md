# BetterReads Recommendation System

## Overview

The BetterReads recommendation system provides personalized book recommendations to users based on their reading history, ratings, and preferences. The system uses multiple recommendation strategies to ensure users always receive relevant book suggestions.

## Features

- **Multi-strategy recommendation engine** that combines:
  - External recommendation API integration
  - Genre-based recommendations
  - Collaborative filtering
  - Popularity-based recommendations

- **Fallback mechanisms** to ensure users always get recommendations even if one strategy fails

- **Personalization** based on user's favorite genres and reading history

- **Filtering** to prevent recommending books the user has already interacted with

## Architecture

### Backend

1. **Models**:
   - `Interaction`: Tracks user interactions with books (ratings, reviews, wishlist additions)
   - `Review`: Stores detailed user reviews and ratings
   - `Book`: Contains book metadata
   - `User`: Stores user preferences including favorite genres

2. **Services**:
   - `recommendations.js`: Core recommendation logic

3. **Routes**:
   - `/api/recommend/:userId`: Endpoint to fetch recommendations for a specific user

### Frontend

- `Recommendations` component: Displays personalized book recommendations with loading states and error handling

## Recommendation Strategies

### 1. External API Recommendations

The system first attempts to get recommendations from an external recommendation API that uses advanced machine learning algorithms. This is the primary recommendation source when available.

```javascript
const response = await axios.post('http://recommender:5001/recommend', {
  user_id: userId.toString(),
  interactions: data
});
```

### 2. Genre-Based Recommendations

Recommends books that match the user's favorite genres with high ratings.

```javascript
const genreBooks = await Book.find({
  genre: { $in: favoriteGenres },
  _id: { $nin: excludeIds },
  averageRating: { $gte: 4 }
})
```

### 3. Collaborative Filtering

Finds users with similar reading tastes and recommends books they rated highly.

1. Identifies users who rated the same books as the current user
2. Ranks these users by the number of overlapping book ratings
3. Recommends books that these similar users rated highly

### 4. Popularity-Based Recommendations (Fallback)

When personalized recommendations aren't available, the system recommends popular books with high ratings.

## Setup and Maintenance

### Initial Setup

1. Ensure all models are properly set up in the database
2. Run the migration script to populate the Interaction model from existing reviews:

```bash
node backend/scripts/migrateReviewsToInteractions.js
```

### Monitoring and Improvement

- The system logs detailed information about each recommendation strategy's performance
- If the external API fails, the system automatically falls back to other strategies
- The recommendation quality improves as users add more ratings and reviews

## Future Enhancements

1. **Content-based filtering** using book descriptions and text analysis
2. **Hybrid recommendation algorithms** that combine multiple approaches
3. **Real-time recommendation updates** when users add new ratings
4. **A/B testing** different recommendation strategies to optimize performance
5. **Explainable recommendations** that tell users why a book was recommended

## Troubleshooting

If users aren't receiving recommendations:

1. Check if they have rated any books (recommendations improve with more user data)
2. Verify the external recommendation API is functioning
3. Check the logs for errors in the recommendation service
4. Ensure the user's favorite genres are properly set in their profile
