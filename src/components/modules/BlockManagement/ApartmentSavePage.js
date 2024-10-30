import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApartmentForm from './ApartmentForm';

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/master/api';

const ApartmentSavePage = () => {
  const { blockId, floorId, id: apartmentId } = useParams(); // Lấy apartmentId từ URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [apartmentData, setApartmentData] = useState(null);
  
  useEffect(() => {
    if (apartmentId) {
      fetchApartmentDetails();
    }
  }, [apartmentId]);

  const fetchApartmentDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/apartments/${apartmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartmentData(response.data); // Lưu dữ liệu căn hộ vào state
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        if (error.response.status === 401) {
          message.error("Unauthorized access. Please login again.");
          navigate("/login");
        } else {
          message.error(`Error: ${error.response.data.error_desc || "Unable to fetch data"}`);
        }
      } else {
        console.error("Error:", error.message);
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        name: values.name,
        area: values.area,
        furniture: values.furniture,
        status: values.status,
        sale_info: {
          purchase_price: values.sale_info?.purchase_price || null,
          sale_date: values.sale_info?.sale_date instanceof Date ? values.sale_info.sale_date.toISOString() : null,
        },
        floor_id: floorId,
      };

      const apiUrl = apartmentId ? `${API_URL}/apartments/${apartmentId}` : `${API_URL}/apartments`;
      const method = apartmentId ? 'put' : 'post';

      await axios[method](apiUrl, payload, { headers });
      message.success(apartmentId ? 'Apartment updated successfully' : 'Apartment added successfully');
      navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        message.error(`Error: ${error.response.data.error_desc || "Failed to save apartment"}`);
      } else {
        console.error("Error:", error.message);
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
  };

  if (loading && apartmentId && !apartmentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">
        {apartmentId ? 'Edit Apartment' : 'Add New Apartment'}
      </Title>
      <ApartmentForm
        initialValues={apartmentData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        isEdit={!!apartmentId}
      />
    </div>
  );
};

export default ApartmentSavePage;
