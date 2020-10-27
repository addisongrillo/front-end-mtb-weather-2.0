import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Link,
} from "@material-ui/core";
import './SignInForm.css'

function SignInForm(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory();

    const handleUsernameChange = (evt) => {
        setUsername(evt.target.value)
    }

    const handlePasswordChange = (evt) => {
        setPassword(evt.target.value)
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        props.changeLoading(true)
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/authenticate`, 
        JSON.stringify({
            username,
            password
        }),
        {headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                    }
        }
        ).then((res) => {
            setUsername("")
            setPassword("")
            props.Login(res.data)
            //props.changeLoading(false)
            history.push("/");
        }).catch( (error) =>{
            if (error.response) {
                console.log(error.response)
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            props.changeLoading(false)
        })   
    }
    const formDivStyle = {
        margin: "auto",
        padding: "20px",
        width: "80%"
    }

    return(
        <div>

            <Grid container spacing={0} justify="center" direction="row">
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            spacing={2}
                            className="login-form"
                        >
                            <Paper
                                variant="elevation"
                                elevation={2}
                                className="login-background"
                            >
                                <Grid item>
                                    <Typography id="signin" component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <form onSubmit={handleSubmit}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item>
                                                <TextField
                                                    placeholder="Username"
                                                    fullWidth
                                                    name="username"
                                                    variant="outlined"
                                                    value={username}
                                                    onChange={handleUsernameChange}
                                                    required
                                                    autoFocus
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    placeholder="Password"
                                                    fullWidth
                                                    name="password"
                                                    variant="outlined"
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    className="button-block"
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                                {/* <Grid item>
                                    <Link href="#" variant="body2">
                                        Forgot Password?
                                    </Link>
                                </Grid> */}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
        </div>
    )
}

export default SignInForm

