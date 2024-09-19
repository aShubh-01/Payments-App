import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import React, { Suspense } from 'react';
import './App.css'

const Signup = React.lazy(() => import('./Components/Signup'));
const Signin = React.lazy(() => import('./Components/Signin'));
const Dashboard = React.lazy(() => import('./Components/Dashboard'));
const Transfer = React.lazy(() => import('./Components/Transfer'));

function App() {

  return (
    <RecoilRoot>
      <div>
          <BrowserRouter>
          <Suspense fallback="Loading...">
            <Routes>
              <Route path ="/signup" element ={<Signup />} />
              <Route path ="/signin" element ={<Signin />} />
              <Route path ="/dashboard" element ={<Dashboard />} />
              <Route path ="/transfer" element ={<Transfer />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
    </div>
    </RecoilRoot>
  )
}

export default App
