import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import axios from 'axios';
import Trail from './trail';
import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DraggableList from './DraggableList'
import './weather.css';



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
  //const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [noTrails, setNoTrails] =useState([false]);
 

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
    await axios(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/trails`,
      {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      }
    ).then((res =>{
      //if(res.data.trail.weather.cod > 0){
      //  console.log('nah')
      //}else{
        setNoTrails(false);
        setWeather(res.data);
      //}
      
    changeLoading(false)
    })

    ).catch( (error) =>{
      if (error.response) {
          setNoTrails(true);
          console.log(error.response)
      } else if (error.request) {
          setNoTrails(true);
          console.log(error.request);
      } else {
        setNoTrails(true);
        console.log('Error', error.message);
      }
      changeLoading(false)
  }) 

    
  };

  useEffect(() => {
    // if(localStorage.getItem("token")!==null){
      if(props.loggedin === true){
      //console.log("loggedin")
      fetchData();
    }
  }, [props.loggedin]);
  const deleteTrail = async (id) => {
    changeLoading(true);
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/trails/${id}`,
      {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      }
    );
    setWeather(weather.filter(x => x.trail.id !== id))
    weather.length < 1 ? setNoTrails(true) : setNoTrails(false)
    changeLoading(false)
    //console.log(result.status)
  }
  const updateOrder = async () => {
    if (order.length > 0) {
      changeLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/trails/changeOrder`, { order: order },
        {
          headers: {
            'Authorization': localStorage.getItem("token")
          }
        }

      );
      fetchData()
    }
    handleClose()
  }
  return (
    <>
    {!props.loggedin &&
      <Link to={'/login'}>
        <h1 id="loginText">Log in to view your trails.</h1>
      </Link>
    }
    {(props.loggedin && noTrails===true) &&
      <Link to={'/AddNewTrail'}>
        <h1 id="addTrailText">You don't have any trails, Click here to add some.</h1>
      </Link>
    }
      <div id="container">
        <Modal
          id="orderModal"
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div id="orderModalDiv" className={classes.paper}>
            <h2 id="simple-modal-title">Update Trail Order.</h2>
            <DraggableList id="orderDrag" list={weather} updateOrderValue={updateOrderValue} />
            <Button id="updateTrailOrderFinalButton" variant="contained" color="primary" onClick={updateOrder}>Update</Button>
          </div>
        </Modal>
        {weather.length > 0 &&
        <Button id="changeOrderButton" variant="contained" color="primary" onClick={handleOpen}>Change Order</Button>}
        {weather.length > 0 &&
          weather.map(t => {
            return <Trail deleteTrail={deleteTrail} changeLoading={changeLoading} key={t.trail.id} trail={t} />
          })
        }
      </div>
    </>
  );
}

export default Weather;
