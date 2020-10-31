import React, { useState, useEffect } from 'react';
import {
  //BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import PropTypes from 'prop-types';
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
  //useTheme,
  makeStyles
} from '@material-ui/core';
// import {
// InboxIcon,
// ListItemIcon,
// MailIcon,
// } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import Weather from './components/weather';
import AddNewTrail from './components/AddNewTrail'
import SignInForm from './components/SignInForm'
import CreateAccount from './components/CreateAccount'
import './App.css'


const drawerWidth = 240;
//const loggedin=true;
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
  // necessary for content to be below app bar
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
  //const [username, setUsername] = useState("");
  const history = useHistory();
  //const LoginToggle = React.useCallback(() => setLoggedin(!loggedin));

  const changeLoading = (val) => {
    setLoading(val);
  }
  
  useEffect(() => {


    if(localStorage.getItem("token")!==null) {
      setLoggedin(true)
      //console.log("yah")
   }else{
     //console.log("nah")
    history.push('/Login')
   }
    //loggedin=== true ? setUsername(localStorage.getItem("username")) : setUsername("")
    //console.log(loggedin)
  }, []);
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    //setUsername("")
    setLoggedin(false)
    history.push("/Login");
  }
  const Login= ( data ) => {
    setLoggedin(true)
    localStorage.setItem("token", data.auth_token)
    localStorage.setItem("username", data.user.username)
    setLoading(true)
    //setUsername(data.user.username)
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
    <div>
      <h3 id="usernameDisplay">{localStorage.getItem("username")}</h3>
      <div className={classes.toolbar} />
      
      <Divider />
      <List>
        {['Home', 'Add New Trail', 'About'].map((text, index) => (
          <Link to={linkUrls[index]} key={text}>
            <ListItem button >
              {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItem>
          </Link>

        ))}
        {loggedin === false && <Link to={linkUrls[3]} key={"Login"}>
            <ListItem button >
              {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
              <ListItemText primary="Login" />
            </ListItem>
          </Link>}
        {loggedin === true && 
          <ListItem button onClick={LogOut} >
            {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
            <ListItemText primary="Log Out" />
          </ListItem>}
      </List>
      {/* <Divider /> */}
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      {/* <Router> */}
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
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
                  <h1>About</h1>
                </Route>
                <Route path="/Login">
                  <SignInForm  Login={Login}  changeLoading={changeLoading}/>
                </Route>
                <Route path="/CreateAccount">
                  <CreateAccount  Login={Login}  changeLoading={changeLoading}/>
                </Route>
                <Route path="/">
                  <Weather key={loggedin} loggedin={loggedin} changeLoading={changeLoading} />
                </Route>
              </Switch>


            </div>
          </main>
        </div>
      {/* </Router> */}
    </ThemeProvider>
  );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default App;
