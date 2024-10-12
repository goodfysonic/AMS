import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const login = async (userId, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth", {
        username: userId,
        password: password,
      });
      if (res.data.access === "granted") {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        navigate("/homepage", { replace: true });
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login", { replace: true });
  };

  return { token, login, logout, loading, error };
};

export default useAuth;
