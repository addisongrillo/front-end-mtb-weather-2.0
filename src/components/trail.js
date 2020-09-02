import React from 'react';

function Trail(props) {
    
  return (
    <>
    <h1>{props.trail.trail.name}</h1>
    {props.trail.weather.length>0 &&
    props.trail.weather.map((h, index) =>{
    return <div key={index}>
            <p>{h.dt}</p>
            <p>{h.temp}</p>
            <p>{h.pop}</p>
           </div>
    })
    }
    </>
  );
}

export default Trail;
