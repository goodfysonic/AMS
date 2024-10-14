import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import ApartmentForm from './ApartmentForm';

const ApartmentSavePage = () => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchApartment();
    }
  }, [id]);

  const fetchApartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8083/api/master/apartments/${id}`);
      setApartment(response.data);
    } catch (error) {
      message.error('Failed to fetch apartment');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (id) {
        await axios.put(`http://localhost:8083/api/master/apartments/${id}`, values);
        message.success('Apartment updated successfully');
      } else {
        await axios.post('http://localhost:8083/api/master/apartments', values);
        message.success('Apartment added successfully');
      }
      navigate('/apartments');
    } catch (error) {
      message.error('Failed to save apartment');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{id ? 'Edit Apartment' : 'Add New Apartment'}</h2>
      <ApartmentForm onSubmit={handleSubmit} initialValues={apartment || {}} />
    </div>
  );
};

export default ApartmentSavePage;
