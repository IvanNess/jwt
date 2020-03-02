import React from 'react'
import LoginPage from './login-page'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ProfilePage from './profile-page'
import CreateLogin from './create-login'
import { ContextProvider } from './context'

function App() {
  return (
    <div className="App">
      <ContextProvider>
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
            <ProfilePage />
          </Route>
        </Router>
      </ContextProvider>
    </div>
  )
}

export default App
