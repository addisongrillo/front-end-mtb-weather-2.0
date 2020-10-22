import React from 'react';
import {Card, CardContent} from '@material-ui/core';
import './trail.css'

function Trail(props) {
    
  return (
    <>
    <Card className="trailCard " variant="outlined">
      <h1>{props.trail.trail.name}</h1>
      <CardContent className="hoursContainer" variant="outlined">
      {props.trail.weather.length>0 &&
      props.trail.weather.map((h, index) =>{
      return <Card className="hours" variant="outlined">
                <div className="innerCard" key={index}>
                  <div>
                    <p>{h.dt}</p>
                    <p>Temp: {Math.round(h.temp)}&#176;</p>
                    <p>Rain: {Math.round(h.pop * 100)}%</p>
                    <p>{h.weather[0].description}</p>
                  </div>
                  <div>
                    <img className="weatherIcon" src={`http://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`}/>
                  </div>
              </div>
            </Card>
      })
      }
      </CardContent>
    </Card>
    </>
  );
}

export default Trail;
