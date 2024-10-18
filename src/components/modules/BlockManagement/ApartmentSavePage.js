import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ApartmentSavePage = () => {
  const { id } = useParams(); // Get ID if editing
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const { floorId } = location.state || {};

  const API_URL = 'http://localhost:8080/master/api';

  useEffect(() => {
    if (id) {
      // Fetch apartment details if editing
      fetchApartmentDetails(id);
    }
  }, [id]);

  const fetchApartmentDetails = async (apartmentId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apartments/${apartmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Failed to fetch apartment details:', error);
      message.error('Failed to fetch apartment details');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (id) {
        // Edit existing apartment
        await axios.put(`${API_URL}/apartments/${id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Apartment updated successfully');
      } else {
        // Add new apartment and associate with floorId
        await axios.post(`${API_URL}/apartments`, { ...values, floorId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Apartment added successfully');
      }
      navigate(`/floors/${floorId}/apartments`); 
    } catch (error) {
      console.error('Failed to save apartment:', error);
      message.error('Failed to save apartment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow rounded">
      <h2>{id ? 'Edit Apartment' : 'Add New Apartment'}</h2>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Apartment Name"
            rules={[{ required: true, message: 'Please enter the apartment name' }]}
          >
            <Input placeholder="Enter apartment name" />
          </Form.Item>

          <Form.Item
            name="area"
            label="Area (sqm)"
            rules={[{ required: true, message: 'Please enter the area' }]}
          >
            <Input placeholder="Enter area in sqm" />
          </Form.Item>

          <Form.Item
            name={['rental_info', 'rental_price']}
            label="Rental Price"
          >
            <Input placeholder="Enter rental price" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
          >
            <Input placeholder="Enter status (Available, Rented, Sold)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? 'Update Apartment' : 'Add Apartment'}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ApartmentSavePage;
