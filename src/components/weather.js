import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Trail from './trail';
import './weather.css';
// import { 
//   CircularProgress
// } from '@material-ui/core';

function Weather(props) {
  function changeLoading(val) {
    // Here, we invoke the callback with the new value
    props.changeLoading(val);
}
    const [weather, setWeather] = useState({ trails: [] });
      useEffect(() => {
        const fetchData = async () => {
          changeLoading(true);
          const result = await axios(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/1/trails`,
          );
     
          setWeather(result.data);
          changeLoading(false)
          //console.log(result.data)
        };
     
        fetchData();
      }, []);
      const deleteTrail  = async (id) => {
        changeLoading(true);
        const result = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/1/trails/${id}`,
        );
        setWeather(weather.filter(x => x.trail.id !== id ))
        changeLoading(false)
        console.log(result.data)
      }
  return (
    <>
    <div id="container">
    
        {weather.length > 0 &&
        weather.map(t => {
           return <Trail deleteTrail={deleteTrail}changeLoading={changeLoading} key={t.trail.id}trail={t}/>
        })
    }
    </div>
    </>
  );
}

export default Weather;
