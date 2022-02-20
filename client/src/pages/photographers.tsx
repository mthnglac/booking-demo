import React from 'react'
import { Link } from 'react-router-dom'
import "../App.scss";

export default function Photographers () {
  return (
    <div className="App">
      <div className="App-card">
        <div className="Card-content">
          <p>Photographers page</p>

          <Link to="/" className="App-link">
            Go back to home page.
          </Link>
        </div>
      </div>
    </div>
  )
}
