// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Search from './components/Search';

function App() {
  return (
      <BrowserRouter>
        {/* CssBaseline normalizes CSS and resets browser defaults */}
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
