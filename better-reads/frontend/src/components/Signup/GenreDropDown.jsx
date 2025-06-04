import React from 'react'
import "../../styles/genre-dropdown.css";

const GenreDropDown = () => {
  return (
    <div className="genre-row">
    <label>
      Pick genre
      <select className="selectGenre">
        <option value="Fantasy">Fantasy</option>
        <option value="Science Fiction">Science Fiction</option>
        <option value="Mystery">Mystery</option>
        <option value="Thriller">Thriller</option>
        <option value="Romance">Romance</option>
        <option value="Historical Fiction">Historical Fiction</option>
        <option value="Horror">Horror</option>
        <option value="Literary Fiction">Literary Fiction</option>
        <option value="Young Adult">Young Adult</option>
        <option value="Biography">Biography</option>
      </select>
    </label>
    </div>
  )
}

export default GenreDropDown
