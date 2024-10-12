import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Nếu không có token, điều hướng người dùng đến trang đăng nhập
    if (!token) {
      window.location.href = "/login";
    } else {
      // Gọi API để lấy dữ liệu và sử dụng token
      axios
        .get("http://localhost:5000/homepage-data", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="homepage">
      <h1>Home Page</h1>
      {data && (
        <div>
          <h2>Welcome, {data.username}</h2>
          
        </div>
      )}
    </div>
  );
};

export default HomePage;
