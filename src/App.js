import React, { useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import Auth from './components/Auth';
import Header from './components/commons/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
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
    </Router>
  );
}

export default App;
