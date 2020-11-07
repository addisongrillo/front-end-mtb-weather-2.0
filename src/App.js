import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  CircularProgress,
  makeStyles
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import Weather from './components/weather';
import AddNewTrail from './components/AddNewTrail'
import SignInForm from './components/SignInForm'
import CreateAccount from './components/CreateAccount'
import About from './components/About'
import './App.css'


const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 10px 10px 60px rgba(0,0,0,0.3)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.3)',
      outline: '0px solid black'
    }
  },
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App(props) {
  const { window } = props;
  const linkUrls = ['/', '/AddNewTrail', '/About', '/Login']
  const [loading, setLoading] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const history = useHistory();

  const changeLoading = (val) => {
    setLoading(val);
  }

  useEffect(() => {


    if (localStorage.getItem("token") !== null) {
      setLoggedin(true)
    } else {
      history.push('/Login')
    }
  }, [history]);
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const closeDrawer = () => {
    if (mobileOpen) {
      setMobileOpen(!mobileOpen);
    }
  }
  const LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedin(false)
    history.push("/Login");
  }
  const Login = (data) => {
    setLoggedin(true)
    localStorage.setItem("token", data.auth_token)
    localStorage.setItem("username", data.user.username)
    setLoading(true)
  }
  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        light: '#487e4c',
        main: '#1b5e20',
        dark: '#124116',
        contrastText: '#fff',
      },
      secondary: {
        light: '#c54949',
        main: '#b71c1c',
        dark: '#801313',
        contrastText: '#000',
      },
    },
  });

  const drawer = (
    <div onClick={closeDrawer}>
      <h3 id="usernameDisplay">{localStorage.getItem("username")}</h3>
      <div className={classes.toolbar} />

      <Divider />
      <List>
        {['Home', 'Add New Trail', 'About'].map((text, index) => (
          <Link to={linkUrls[index]} key={text}>
            <ListItem button >
              <ListItemText primary={text} />
            </ListItem>
          </Link>

        ))}
        {loggedin === false && <Link to={linkUrls[3]} key={"Login"}>
          <ListItem button >
            <ListItemText primary="Login" />
          </ListItem>
        </Link>}
        {loggedin === true &&
          <ListItem button onClick={LogOut} >
            <ListItemText primary="Log Out" />
          </ListItem>}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      {loading && <CircularProgress className="Spinner" size="6rem" />}
      <div className={classes.root}>
        <CssBaseline />

        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              MTB Weather
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div id="container">


            <Switch>
              <Route path="/AddNewTrail">
                <AddNewTrail key={loggedin} loggedin={loggedin} changeLoading={changeLoading} />
              </Route>
              <Route path="/About">
                <About />
              </Route>
              <Route path="/Login">
                <SignInForm Login={Login} changeLoading={changeLoading} />
              </Route>
              <Route path="/CreateAccount">
                <CreateAccount Login={Login} changeLoading={changeLoading} />
              </Route>
              <Route path="/">
                <Weather key={loggedin} loggedin={loggedin} changeLoading={changeLoading} />
              </Route>
            </Switch>


          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}



export default App;
