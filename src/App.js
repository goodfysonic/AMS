import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import Auth from './components/Auth';
import Header from './components/commons/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/'); // Điều hướng về trang chủ nếu đã đăng nhập
    } else {
      setIsAuthenticated(false);
      navigate('/login'); // Điều hướng đến trang login nếu chưa đăng nhập
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <Header setIsAuthenticated={setIsAuthenticated} /> 
          <AppRoutes />
        </>
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />  
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
