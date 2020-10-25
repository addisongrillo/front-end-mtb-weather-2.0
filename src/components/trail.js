import React, {useState} from 'react';
import {Card, CardContent} from '@material-ui/core';
import {Button, Modal} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
  
  const handleOpen = (id) => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  function deleteTrail() {
    props.deleteTrail(props.trail.trail.id);
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
        <h1>{props.trail.trail.name}</h1>
        <Button id ="deleteTrailButton"variant="contained" color="secondary" onClick={handleOpen}>Delete Trail</Button>
      </div>
      <CardContent className="hoursContainer" variant="outlined">
      {props.trail.weather.hourly.length>0 &&
      props.trail.weather.hourly.map((h, index) =>{
      return <Card key={index} className="hours" variant="outlined">
                <div className="innerCard" >
                  <div>
                    <p>{moment.unix(h.dt).format("ha MM/DD")}</p>
                    <p>Temp: {Math.round(h.temp)}&#176;</p>
                    <p>Rain: {Math.round(h.pop * 100)}%</p>
                    <p>{h.weather[0].description}</p>
                  </div>
                  <div>
                    <img className="weatherIcon" src={`http://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`} alt="weather icon"/>
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
