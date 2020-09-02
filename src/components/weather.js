import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Trail from './trail'

function Weather() {
    const [weather, setWeather] = useState({ hits: [] });
      useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            `http://localhost:3000/api/v1/users/1/trails`,
          );
     
          setWeather(result.data);
          console.log(result.data)
        };
     
        fetchData();
      }, []);
  return (
    <>
    <div id="container">
        {weather.length > 0 &&
        weather.map(t => {
           return <Trail key={t.trail.id}trail={t}/>
        })
    }
    </div>
    </>
  );
}

export default Weather;
