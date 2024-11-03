import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import BlockForm from './BlockForm';

const BlockSavePage = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  const handleSubmit = async (values) => {
    console.log("Submitting values:", values); // Debugging line to log the payload
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/master/api/blocks`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response data:", response.data); // Debugging line to check the response
      message.success('Block added successfully');
      navigate('/blocks');
    } catch (error) {
      if (error.response) {
        // Error response from the server
        console.error("Error response:", error.response.data);
        message.error(`Failed to add block: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
        message.error('No response from server');
      } else {
        // Other errors
        console.error("Error message:", error.message);
        message.error('An error occurred while adding the block');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add New Block</h2>
      {saving ? <Spin size="large" /> : <BlockForm onFinish={handleSubmit} initialValues={{}} loading={saving} />}
    </div>
  );
};

export default BlockSavePage;
