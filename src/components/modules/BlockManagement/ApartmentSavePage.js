import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApartmentForm from './ApartmentForm';

const { Title } = Typography;

const ApartmentSavePage = () => {
  const { blockId, floorId, id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [apartmentData, setApartmentData] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/master/api';

  useEffect(() => {
    if (id) {
      fetchApartmentDetails();
    }
  }, [id]);

  const fetchApartmentDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apartments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartmentData(response.data);
    } catch (error) {
      console.error('Failed to fetch apartment details:', error);
      message.error('Failed to fetch apartment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        name: values.name,
        area: values.area,
        status: values.status,
        furniture: values.furniture || false,
        sale_info: {
          purchase_price: values.sale_info?.purchase_price || null,
          sale_date: values.sale_info?.sale_date ? values.sale_info.sale_date.toISOString() : null,
        },
      };

      if (id) {
        payload.apartment_id = id;
        await axios.put(`${API_URL}/apartments/${id}`, payload, { headers });
        message.success('Apartment updated successfully');
      } else {
        payload.floor_id = floorId;
        await axios.post(`${API_URL}/apartments`, payload, { headers });
        message.success('Apartment added successfully');
      }
      navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
    } catch (error) {
      console.error('Failed to save apartment:', error);
      message.error('Failed to save apartment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
  };

  if (loading && id && !apartmentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">
        {id ? 'Edit Apartment' : 'Add New Apartment'}
      </Title>
      <ApartmentForm
        initialValues={apartmentData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        isEdit={!!id}
      />
    </div>
  );
};

export default ApartmentSavePage;
