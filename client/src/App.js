import React from 'react'
import LoginPage from './login-page'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ProfilePage from './profile-page'
import CreateLogin from './create-login'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path='/'>
          Hello world!!!
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route exact path='/create'>
          <CreateLogin />
        </Route>
        <Route exact path='/profile'>
          <ProfilePage/>
        </Route>
      </Router>

    </div>
  )
}

export default App
