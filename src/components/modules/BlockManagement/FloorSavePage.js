import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import FloorForm from './FloorForm';

const FloorSavePage = () => {
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { floorId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  useEffect(() => {
    if (floorId) {
      fetchFloor();
    }
  }, [floorId]);

  const fetchFloor = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/master/api/floors/${floorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFloor(response.data);
    } catch (error) {
      message.error('Failed to fetch floor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (floorId) {
        await axios.put(`${API_URL}/master/api/floors/${floorId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Floor updated successfully');
      } else {
        await axios.post(`${API_URL}/master/api/floors`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Floor added successfully');
      }
      navigate('/blocks');
    } catch (error) {
      message.error('Failed to save floor');
    } finally {
      setSaving(false);
    }
  };

  if (floorId && loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>{floorId ? 'Edit Floor' : 'Add New Floor'}</h2>
      <FloorForm onFinish={handleSubmit} initialValues={floor || {}} loading={saving} />
    </div>
  );
};

export default FloorSavePage;
