import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, message } from 'antd';
import axios from 'axios';
import InvoiceForm from '../InvoiceManagement/InVoiceForm';

const { Title } = Typography;

const InvoiceSavePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [services, setServices] = useState([]);

  const API_URL = 'http://localhost:8080/master/api';
  const isEditMode = !!id;

  // Fetch the invoice details if in edit mode
  const fetchInvoice = useCallback(async () => {
    if (!isEditMode) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data);
    } catch (error) {
      message.error('Failed to fetch invoice details');
      navigate('/invoices');
    }
  }, [id, isEditMode, navigate, API_URL]);

  // Fetch all apartments
  const fetchApartments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartments(response.data.items);
    } catch (error) {
      message.error('Failed to fetch apartments');
    }
  }, [API_URL]);

  // Fetch all services from service_detail API
  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/service_details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data.items);
    } catch (error) {
      message.error('Failed to fetch services');
    }
  }, [API_URL]);

  useEffect(() => {
    Promise.all([
      fetchInvoice(),
      fetchApartments(),
      fetchServices()
    ]);
  }, [fetchInvoice, fetchApartments, fetchServices]);

  // Submit the form for either creating or updating the invoice
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = isEditMode 
        ? `${API_URL}/invoices/${id}`
        : `${API_URL}/invoices`;

      const method = isEditMode ? 'put' : 'post';

      await axios[method](endpoint, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(`Invoice ${isEditMode ? 'updated' : 'created'} successfully`);
      navigate('/invoices');
    } catch (error) {
      message.error(`Failed to ${isEditMode ? 'update' : 'create'} invoice`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Title level={2} className="mb-6">
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </Title>

      <InvoiceForm
        onFinish={handleSubmit}
        initialValues={initialValues}
        loading={loading}
        apartments={apartments}
        services={services}
      />
    </div>
  );
};

export default InvoiceSavePage;
