import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
