// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Search from './components/Search';
import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <BrowserRouter>
      {/* Optionally, you can wrap your routes in a layout */}
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Show the LogoutButton only on pages other than Login */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search"
            element={
              <>
                <LogoutButton />
                <Search />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
