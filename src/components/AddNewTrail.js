import React, { useState } from 'react';
import {
  Link
} from "react-router-dom";
import './AddNewTrail.css';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode"
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { useMediaQuery } from '../hooks/useMediaQuery';
function AddNewTrail(props) {

  const isMobile = useMediaQuery('(Max-width: 600px)');
  const changeLoading = (val) => {
    // Here, we invoke the callback with the new value
    props.changeLoading(val);
  }

  const addTrail = async (props) => {
    const trail = {
      name: trailName,
      lat: map.center.lat().toFixed(3),
      lon: map.center.lng().toFixed(3)
    }
    changeLoading(true);
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/trails?name=${trail.name}&lat=${trail.lat}&lon=${trail.lon}`, {},
      {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      }
    );
    changeLoading(false)
    setTrailAdded(true)
    setTimeout(
      function () {
        setTrailAdded(false)
      }, 2000);
    console.log(result.data)
  }
  const [map, setMap] = useState(null);
  const [mapSearch, setMapSearch] = useState(null);
  const [trailName, setTrailName] = useState(null);
  const [trailAdded, setTrailAdded] = useState(false);

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);

  const handleApiLoaded = (map, maps) => {
    setMap(map)
  };
  const move = (e) => {
    e.preventDefault()
    const search = mapSearch
    if (search) {
      Geocode.fromAddress(search)
        .then(
          response => {
            const { lat, lng } = response.results[0].geometry.location
            map &&
              map.setCenter({ lat: lat, lng: lng })
          }
        )
    }
  }
  const searchText = (e) => {
    setMapSearch(e.target.value)
  }
  const changeTrailName = (e) => {
    setTrailName(e.target.value)
  }

  const style = {
    container: isMobile => ({
      margin: isMobile ? '0 auto' : '30px',
      height: isMobile ? '30vh' : '50vh',
      width: isMobile ? '70vw' : '70vh',
      textalign: 'center'
    })
  };
  return (
    <>
      {!props.loggedin &&
        <Link to={'/login'}>
          <h1 id="loginText">Log in to add a new Trail.</h1>
        </Link>
      }
      {props.loggedin &&
        <div>
          <div>
            <h1 id="header">Add New Trail</h1>
          </div>
          <div id="antContainer">
            <div>
              <div id='gMap' style={style.container(isMobile)}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
                  defaultCenter={{
                    lat: 26.134,
                    lng: -80.351
                  }}
                  defaultZoom={14}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}

                >
                </GoogleMapReact>
              </div>
              <form id="searchForm">
                <TextField id="search-input"
                  label="Search for a Trail by name or City"
                  autoComplete="off"
                  placeholder='Markham Park'
                  variant="outlined"
                  onChange={searchText}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      move(e)
                    }
                  }}
                />
                <Button onClick={move} id="submitButton" variant="contained" color="primary" type="submit">Search</Button>
              </form>
            </div>
            <div id="AntForm">
              <h2>Position the center of the map over the Trail</h2>
              <h2>You can Drag the map or use the Search Bar</h2>
              <TextField id="newTrailName"
                label="Trail Name"
                autoComplete="off"
                variant="outlined"
                onChange={changeTrailName}
              />
              <Button id="addTrailBtn" variant="contained" color="primary" onClick={addTrail}>Add Trail</Button>
              {trailAdded && <p id="trailAdded">Trail Added!</p>}
            </div>
          </div>
        </div>}
    </>
  )
}

export default AddNewTrail;
