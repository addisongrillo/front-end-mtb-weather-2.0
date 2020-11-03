import React, { useState, useEffect } from 'react';
import {Card, CardContent} from '@material-ui/core';
import {Button, Modal, Slider, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment'
import './trail.css'

const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Trail(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [weather, setWeather] = useState({ hours: [] });
  const [apiDown, setApiDown] =useState([false]);

  const hoursAgo = [
    {
      value: 0,
      label: 'Future Only',
    },
    {
      value: 1,
      label: '6 hours',
    },
    {
      value: 2,
      label: '12 hours',
    },
    {
      value: 3,
      label: '24 hours',
    }
  ];
  
  useEffect(() => {
    if (props.trail.weather.cod >0){
      setApiDown(true)
    }else{
      setWeather(props.trail.weather.hourly)
    }
      
  }, [props.trail.weather.hourly]);
  
  const handleOpen = (id) => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  const deleteTrail = () => {
    props.deleteTrail(props.trail.trail.id);
  }
  
  const changeHistory = async (event, value) => {
    if (value > 0)
    {props.changeLoading(true);
    await axios(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/trails/history?id=${props.trail.trail.id}`,
      {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      }
    ).then((res =>{
      let hist = res.data.weather_y.hourly
      hist.splice(22,1)
      let hist2=hist.concat(res.data.weather_t.hourly).filter(h => h.dt < ((Math.floor(Date.now() / 1000))-3600))
      let hist3=[]
      switch (value){
        case 1:
          hist3=hist2.filter(h => h.dt > ((Math.floor(Date.now() / 1000))-25200))
          setWeather(hist3.concat(props.trail.weather.hourly))
          break
        case 2:
          hist3=hist2.filter(h => h.dt > ((Math.floor(Date.now() / 1000))-46800))
          setWeather(hist3.concat(props.trail.weather.hourly))
          break
        default:
          hist3=hist2.filter(h => h.dt > ((Math.floor(Date.now() / 1000))-90000))
          setWeather(hist3.concat(props.trail.weather.hourly))
      }

      //setWeather(hist.concat(props.trail.weather.hourly))
      //console.log(weather)
      props.changeLoading(false)
    })

    ).catch( (error) =>{
      if (error.response) {
          console.log(error.response)
      } else if (error.request) {
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }
      props.changeLoading(false)
  })}else{
    setWeather(props.trail.weather.hourly)
  }
}
  
  
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Are you sure you want to delete this {props.trail.trail.name}?</h2>
      <Button id ="deleteTrailFinalButton"variant="contained" color="secondary" onClick={deleteTrail}>Delete</Button>
    </div>
  );
  return (
    <>
    <Card className="trailCard " variant="outlined">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <div className="headerAndDelete">
        <h1 id='trailName'>{props.trail.trail.name}</h1>
        { !apiDown &&
         <div id="historySlider">
          <Typography  id="ShowHistoryLabel" gutterBottom>
            Show History
          </Typography>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider-custom"
            step={1}
            max={3}
            valueLabelDisplay="off"
            marks={hoursAgo}
            onChangeCommitted={changeHistory}
          />
        </div>}
        <Button id ="deleteTrailButton"variant="contained" color="secondary" onClick={handleOpen}>Delete Trail</Button>
      </div>
      <CardContent className="hoursContainer" variant="outlined">
      {apiDown==true &&
        <h1>Weather info currently not available</h1>
      }
      
      {weather.length>0 &&
      weather.map((h, index) =>{
      return <Card key={index} className="hours" variant="outlined">
                 <h2 className='timeDate'>{moment.unix(h.dt).format("ha MM/DD")}</h2>
                <div className="innerCard" >
                  <div>
                    <img className="weatherIcon" src={`http://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`} alt="weather icon"/>
                  </div>
                  <div className="wInfo">
                    <p>Temp: {Math.round(h.temp)}&#176;</p>
                    {h.pop != null &&
                      <p>Rain Chance: {Math.round(h.pop * 100)}%</p>
                    }
                    <p>{h.weather[0].description}</p>
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
