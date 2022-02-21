import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./photographers.scss";

export default function Photographers () {
  const [photographers, setPhotographers] = useState([])
  const [availablePhotographers, setAvailablePhotographers] = useState([])
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    ;(async () => {
      const response = await fetch("http://127.0.0.1:3000/photographers")
      const photographers = await response.json()
      setPhotographers(photographers)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`http://127.0.0.1:3000/available-photographers?duration=${duration}`)
      const availablePhotographers = await response.json()
      setAvailablePhotographers(availablePhotographers)
    })()
  }, [duration])

  const handleDurationChange = (event) => {
    setDuration(event.target.value)
  }

  const formatDate = (string) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }

    return new Date(string).toLocaleDateString([], options)
  }

  return (
    <div className="Photographers">
      <div className="Photographers-card">
        <div className="Card-content">
          <p>Current Photographers</p>

          <ul>
            {photographers.map(item => <li key={item._id}>{item.name}</li>)}
          </ul>

          <div className="Duration-container">
            <p>Choose duration</p>
            <form>
              <select className="form-select" value={duration} onChange={handleDurationChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
              </select>
            </form>
            <small>(Dates will have converted according to your time zone)</small>
          </div>

          <table>
            <tbody>
              <tr>
                <th>Photographer</th>
                <th>TimeSlot</th>
              </tr>
              {availablePhotographers.map(item => (
                <tr key={item.photographer.id}>
                  <td>
                    {item.photographer.name}
                  </td>
                  <td>
                    {formatDate(item.timeSlot.starts)}
                    {" "}-{" "}
                    {formatDate(item.timeSlot.ends)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link to="/" className="App-link">
            Go back to home page.
          </Link>
        </div>
      </div>
    </div>
  )
}
