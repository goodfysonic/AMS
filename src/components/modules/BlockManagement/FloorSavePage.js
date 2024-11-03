import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import FloorForm from './FloorForm';

const FloorSavePage = ({ onAddFloor }) => {
  const [saving, setSaving] = useState(false);
  const { blockId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        ...values,
        block_id: blockId,  // đảm bảo blockId được truyền trong payload
      };

      await axios.post(`${API_URL}/master/api/floors`, payload, { headers });
      message.success('Floor added successfully');
      // Gọi onAddFloor để cập nhật danh sách tầng nếu cần
      if (onAddFloor) {
        onAddFloor();
      }

      navigate(`/blocks`);
    } catch (error) {
      message.error('Failed to add floor');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add New Floor</h2>
      {saving ? (
        <Spin size="large" />
      ) : (
        <FloorForm onFinish={handleSubmit} initialValues={{}} loading={saving} blockId={blockId} />
      )}
    </div>
  );
};

export default FloorSavePage;
