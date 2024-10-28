import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import RenterForm from './RenterForm';
import axios from 'axios';

const RenterSavePage = () => {
  const { renterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
  const API_URL = 'http://localhost:8080/master/api/renters';

  useEffect(() => {
    if (renterId) {
      fetchRenterDetails();
    }
  }, [renterId]);

  const fetchRenterDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${renterId}`);
      setInitialValues(response.data);
    } catch (error) {
      message.error('Failed to fetch renter details');
      navigate('/residents/renters');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (renterId) {
        await axios.put(`${API_URL}/${renterId}`, values);
        message.success('Renter updated successfully');
      } else {
        await axios.post(API_URL, values);
        message.success('Renter created successfully');
      }
      navigate('/residents/renters');
    } catch (error) {
      message.error('Failed to save renter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title={renterId ? 'Edit Renter' : 'Add New Renter'}>
        <RenterForm form={form} initialValues={initialValues} onFinish={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default RenterSavePage;
