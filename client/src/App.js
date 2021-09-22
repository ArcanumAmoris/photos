import './App.css';
import {Router, Switch, Route, Redirect} from "react-router-dom"
import Home from './Components/Home/Home';
import Register from './Components/Auth/Register/Register';
import Login from './Components/Auth/Login/Login';
import Photo from './Components/Photos/ClickedPhoto/Photo'; 
import Favorites from './Components/Photos/Favorites/Main/Favorites';
import Trash from './Components/Photos/Trash/Main/Trash';
// import Account from './Components/Account/Main/Account';
import ClickedIMGTrash from "./Components/Photos/Trash/ClickedIMGTrash/ClickedIMGTrash"
import Profile from './Components/Account/Profile/Profile';
import history from './history';
import ClickedFavorite from './Components/Photos/Favorites/ClickedFavorite/ClickedFavorite';
import Settings from './Components/Settings/Main/Settings';
// import Upgrade from './Components/Settings/Upgrade/Main/Upgrade';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
// import Success from './Components/Settings/Upgrade/Success/Success';
import Welcome from './Components/Auth/Welcome/Welcome';
 
export default function App() {
  const darkTheme = useSelector(state => state.DarkThemeReducer)
  const Auth = localStorage.getItem("userID")

  useEffect(() => {
    if (darkTheme) {
        document.body.classList.add("dark")
    } else {
        document.body.classList.remove("dark")
    }
  }, [darkTheme])

  return (
      <Router history={history}>
        <Switch>
          <Route component={Register} exact path="/register"/>
          <Route component={Login} exact path="/login"/>
          <Route component={Welcome} exact path="/welcome"/>
          {Auth ? <Route component={Home} exact path="/" /> : <Redirect to="/login" />}
          {Auth ? <Route component={Photo} exact path="/photo" /> : <Redirect to="login" />}
          {Auth ? <Route component={Favorites} exact path="/favorites" /> : <Redirect to="login" />}
          {Auth ? <Route component={Trash} exact path="/trash" /> : <Redirect to="login" />}
          {Auth ? <Route component={ClickedIMGTrash} exact path="/trash/photo" /> : <Redirect to="login" />}
          {/* {Auth ? <Route component={Account} path="/account" exact /> : <Redirect to="login" />} */}
          {Auth ? <Route component={Profile} exact path="/account/profile" /> : <Redirect  to="login" />}
          {Auth ? <Route component={ClickedFavorite} exact path="/favorite/photo" /> : <Redirect  to="login" />}
          {Auth ? <Route component={Settings} exact path="/settings" /> : <Redirect  to="login" />}
          {/* {Auth ? <Route component={Upgrade} path="/settings/upgrade" exact /> : <Redirect  to="login" />} */}
          {/* {Auth ? <Route component={Success} path="/settings/upgrade/success" exact /> : <Redirect  to="login" />} */}
          <Redirect to="/"/>
        </Switch>
      </Router>
  );
}