import React from 'react';
import './About.css'


function About() {

  return (
    <>
      <div id='aboutContainer'>
      <img id='bikewheel' src={process.env.PUBLIC_URL + '/bikewheel.ico'}/>
        <div id='aboutText'>
          <h1>About</h1>
          <p className='apara'>MTB Weather is a mountain biking specific weather app.</p>
          <p className='apara'>Add you favorite trails and instantly see the upcoming weather forecast so you always know which trail will be dry.</p>
          <p className='apara'>You can also view weather for the past 24 hours to see if the trail is still wet from previous rain.</p>
          <p className='apara'>MTB Weather is a Progressive Web App.  This means you can install it directly on your device from the website.</p>
          <p className='apara'>If you are using google chrome, just click the 3 dots in the top right corner, then if you're on a mobile device, select add to home screen.  Otherwise select Install MTB Weather.</p>
          <p className='apara'>MTB Weather uses the OpenWeather API for forecast information as well as the Google Maps API for maps integration and location search.</p>
        </div>
        
      </div>
    </>
  );
}

export default About;



