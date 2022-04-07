import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import RAMPSDK from './components/Ramp/SDK';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/ramp' element={<RAMPSDK />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
