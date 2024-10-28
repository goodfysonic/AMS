import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import OwnerForm from './OwnerForm';
import axios from 'axios';

const OwnerSavePage = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
  const API_URL = 'http://localhost:8080/master/api/owners';

  useEffect(() => {
    if (ownerId) {
      fetchOwnerDetails();
    }
  }, [ownerId]);

  const fetchOwnerDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authorization token is missing. Please log in again.');
        navigate('/login');
        return;
      }

      console.log("Attempting to fetch details for owner ID:", ownerId); // Debug log

      const response = await axios.get(`${API_URL}/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response for owner details:", response.data); // Log API response
      setInitialValues(response.data);
      form.setFieldsValue(response.data);
      message.success('Owner details fetched successfully');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error('Owner not found. Returning to owner list.');
      } else {
        message.error('Failed to fetch owner details');
      }
      console.error("Error fetching owner details:", error); // Detailed error log
      navigate('/residents/owners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authorization token is missing. Please log in again.');
        navigate('/login');
        return;
      }

      const method = ownerId ? 'put' : 'post';
      const endpoint = ownerId ? `${API_URL}/${ownerId}` : API_URL;

      console.log(`Attempting to ${ownerId ? 'update' : 'create'} owner with ID:`, ownerId); // Log action
      console.log("Submitted values:", values); // Log submitted values

      await axios[method](endpoint, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(`Owner ${ownerId ? 'updated' : 'created'} successfully`);
      navigate('/residents/owners');
    } catch (error) {
      message.error(`Failed to ${ownerId ? 'update' : 'create'} owner`);
      console.error(`Error ${ownerId ? 'updating' : 'creating'} owner:`, error); // Detailed error log
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title={<h2 className="text-xl font-semibold">{ownerId ? 'Edit Owner' : 'Add Owner'}</h2>} className="shadow-sm rounded-lg">
        <OwnerForm form={form} initialValues={initialValues} onFinish={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default OwnerSavePage;
