import sampleData from "./sampleData.json";
import './App.css'
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";

function App() {


  return (
    <>
      <BookDetailsPage book={sampleData.book} similarBooks={sampleData.similarBooks} userReview={sampleData.userReview}
      otherReviews={sampleData.otherReviews}>

      </BookDetailsPage>
    </>
  )
}

export default App
