import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Trail from './trail';
import {Button, Modal} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DraggableList from './DraggableList'
import './weather.css';

const getModalStyle = () => {
  //const top = 0
  //const left = 0

  return {
    //top: `${top}%`,
    //left: `${left}%`,
    //transform: `translate(-${top}%, -${left}%)`,
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



function Weather(props) {
  const classes = useStyles();
  const [weather, setWeather] = useState({ trails: [] });
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);

  const handleOpen = (id) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const updateOrderValue = (arr) => {
    setOrder(arr)
    
  }
  
  function changeLoading(val) {
    props.changeLoading(val);
}
      const fetchData = async () => {
        changeLoading(true);
        const result = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/1/trails`,
        );

        setWeather(result.data);
        console.log(result.data)
        changeLoading(false)
      };

      useEffect(() => {
        fetchData();
      }, []);
      const deleteTrail  = async (id) => {
        changeLoading(true);
        const result = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/1/trails/${id}`,
        );
        setWeather(weather.filter(x => x.trail.id !== id ))
        changeLoading(false)
        console.log(result.status)
      }
      const updateOrder = async () =>{
        if (order.length > 0){
          changeLoading(true);
        const result =  await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/1/trails/changeOrder`, {order: order}
        );
        fetchData()
        changeLoading(false)
        }
        handleClose()
      }
  return (
    <>
    <div id="container">
    <Modal
        id="orderModal"
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
    <h2 id="simple-modal-title">Update Trail Order.</h2>
    <DraggableList list={weather} updateOrderValue={updateOrderValue}/>
    <Button id ="updateTrailOrderFinalButton"variant="contained" color="primary" onClick={updateOrder}>Update</Button>
  </div>
      </Modal>
    <Button id ="changeOrderButton"variant="contained" color="primary" onClick={handleOpen}>Change Order</Button>
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
