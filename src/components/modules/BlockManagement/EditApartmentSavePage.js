import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditApartmentForm from './EditApartmentForm';

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/master/api';

const EditApartmentSavePage = () => {
  const { blockId, floorId, id: apartmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [apartmentData, setApartmentData] = useState(null);
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    if (apartmentId) {
      fetchApartmentDetails();
    }
    fetchAllApartmentNames();
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
      setApartmentData(response.data);
    } catch (error) {
      handleError(error, "Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApartmentNames = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const names = response.data.map(apartment => apartment.name);
      setExistingNames(names);
    } catch (error) {
      handleError(error, "Unable to fetch apartment names");
    }
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      message.error(error.response.data.error_desc || defaultMessage);
      if (error.response.status === 401) {
        navigate("/login");
      }
    } else {
      console.error("Error:", error.message);
      message.error("An unexpected error occurred.");
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
      
      if (existingNames.includes(values.name) && values.name !== apartmentData.name) {
        message.error("This apartment name already exists. Please choose a different name.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        floor_id: floorId,
        sale_info: {
          purchase_price: values.sale_info?.purchase_price || 0,
          sale_date: values.sale_info?.sale_date || null,
        },
      };

      await axios.put(`${API_URL}/apartments/${apartmentId}`, payload, { headers });
      message.success('Apartment updated successfully');
      navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
    } catch (error) {
      handleError(error, "Failed to save apartment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
  };

  if (loading && !apartmentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">Edit Apartment</Title>
      <EditApartmentForm
        initialValues={apartmentData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        apartmentNames={existingNames}
      />
    </div>
  );
};

export default EditApartmentSavePage;
