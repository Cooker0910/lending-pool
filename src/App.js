import './App.css';
import './components/Spinner/Spinner.css'
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Spinner from './components/Spinner/Spinner';

function App() {
  const [spinnerStatus, setSpinner] = useState(false)
  const [test, setTest] = useState(false)

  const setSpinnerFlag = (flag) => { setTest(flag) }
  useEffect(() => {
    setSpinner(test)
  }, [test])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={
            <Dashboard 
              spinner={setSpinnerFlag}
            />
          } />
        </Routes>
      </div>
      {
        spinnerStatus ?
        <Spinner />
        :
        <></>
      }
    </Router>
  );
}

export default App;
