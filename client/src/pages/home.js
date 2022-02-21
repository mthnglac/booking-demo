import React from 'react'
import { Link } from 'react-router-dom'
import "../App.scss";

export default function Home () {
  return (
    <div className="App">
      <div className="App-card">
        <div className="Card-content">
          <p>Booking Demo App</p>

          <Link to="/photographers" className="App-link">
            Available photographers
          </Link>
        </div>
      </div>
    </div>
  )
}
