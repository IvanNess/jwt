import React, {useContext} from 'react'
import LoginPage from './login-page'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProfilePage from './profile-page'
import CreateLogin from './create-login'
import { ContextProvider, Context } from './context'
import Header from './header'
import AuthChecker from './auth-checker'


function App() {
  return (
    <div className="App">
      <ContextProvider>
        <Router>
          <Route exact path='/'>
            Hello world!!!
            </Route>
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/create'>
            <CreateLogin />
          </Route>
          <Route exact path='/profile' role={['user']}>
            <ProfilePage />
          </Route>

          <Switch>
            <Route path='/user/:slug' component={Header} />
          </Switch>
        </Router>

      </ContextProvider>
    </div>
  )
}

export default App
