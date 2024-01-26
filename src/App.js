import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
const api = {
    key:'fb7b091d3948d0bb133243c89f5e44f8',
    base : 'https://api.openweathermap.org/data/2.5/',
}
function getWindDirection(degrees) {
    if (degrees >= 337.5 || degrees < 22.5) {
        return 'North';
    } else if (degrees >= 22.5 && degrees < 67.5) {
        return 'Northeast';
    } else if (degrees >= 67.5 && degrees < 112.5) {
        return 'East';
    } else if (degrees >= 112.5 && degrees < 157.5) {
        return 'Southeast';
    } else if (degrees >= 157.5 && degrees < 202.5) {
        return 'South';
    } else if (degrees >= 202.5 && degrees < 247.5) {
        return 'Southwest';
    } else if (degrees >= 247.5 && degrees < 292.5) {
        return 'West';
    } else if (degrees >= 292.5 && degrees < 337.5) {
        return 'Northwest';
    } else {
        return 'Unknown';
    }
}
function App() {

    const [search, setSearch] = useState("")
    const [weather, setWeather] = useState({});
    const mapRef = useRef(null);

    const [quotes, setQuotes] = useState([]);
    const apiKey = 'k6SK66MCsONdbT9b2yj0rQ==heNZo9SOJbsTA8uh';

    useEffect(() => {
        if (weather.coord && mapRef.current) {
            mapRef.current.setView([weather.coord.lat, weather.coord.lon], 10);
        }
    }, [weather.coord]);

    useEffect(() => {
        const category = 'happiness';

        axios.get('https://api.api-ninjas.com/v1/quotes', {
            params: {
                category: category,
            },
            headers: {
                'X-Api-Key': apiKey,
            },
        })
            .then(response => {
                setQuotes(response.data);
            })
            .catch(error => {
                console.error('Request failed:', error);
            });
    }, [apiKey]);




    const searchPressed = ()=>{
        fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
            .then(res=>res.json())
            .then((result)=> {
                setWeather(result);
                console.log(result);
            });
    }
    return (
            <div className="app">

                <div className="quotes">
                    <h1>Quotes</h1>
                    <ul>
                        {quotes.map((quote, index) => (
                            <li key={index}>{quote.quote}</li>
                        ))}
                    </ul>
                </div>
                <div className="search">

                    <h1> Weather forecast</h1>
                      <div>
                          <input
                          type="text"
                          placeholder="Input your city name..."
                          onChange={(e)=>setSearch((e.target.value))}/>

                          <button onClick={searchPressed}>Search</button>
                      </div>
                </div>



                <div className="results">
                      <p id="cityName">{weather.name}</p>
                    {weather.coord && <p>Lon: {weather.coord.lon} , Lat: {weather.coord.lat}</p>}
                    {weather.main && <p>Pressure: {weather.main.pressure}Pa</p>}
                    {weather.main && <p>Humidity: {weather.main.humidity}%</p>}
                        <table>
                            <tr>
                                <td id="temp">{weather.main && weather.weather && <span><img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt=""/> {weather.main.temp} °C</span>}</td>
                                <td>{weather.main && <p><span className="fl"> Feels like:</span> <span className="fl">{weather.main.feels_like} °C</span></p>}</td>
                            </tr>
                            <tr>
                                <td id="wind">
                                    {weather.wind && (
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-wind" viewBox="0 0 16 16">
                                                <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5"/>
                                            </svg> {weather.wind.speed} m/s
                                        </p>
                                    )}
                                </td>

                                <td>
                                    {weather.wind && getWindDirection(weather.wind.deg)}
                                </td>
                            </tr>
                        </table>
                </div>
                {weather.coord && (
                    <MapContainer
                        ref={mapRef}
                        center={[weather.coord.lat, weather.coord.lon]}
                        zoom={10}
                        style={{ height: "640px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[weather.coord.lat, weather.coord.lon]}>
                            <Popup>{weather.name}</Popup>
                        </Marker>
                    </MapContainer>
                )}
                <div id="footer">
                    <p>Baitenov Arsen SE-2211</p>
                </div>
            </div>

);
}

export default App;