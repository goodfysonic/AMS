import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import BlockForm from './BlockForm';

const BlockSavePage = () => {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { blockId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  useEffect(() => {
    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  const fetchBlock = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/master/api/blocks/${blockId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlock(response.data);
    } catch (error) {
      message.error('Failed to fetch block');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (blockId) {
        await axios.put(`${API_URL}/master/api/blocks/${blockId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Block updated successfully');
      } else {
        await axios.post(`${API_URL}/master/api/blocks`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Block added successfully');
      }
      navigate('/blocks');
    } catch (error) {
      message.error('Failed to save block');
    } finally {
      setSaving(false);
    }
  };

  if (blockId && loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>{blockId ? 'Edit Block' : 'Add New Block'}</h2>
      <BlockForm onFinish={handleSubmit} initialValues={block || {}} loading={saving} />
    </div>
  );
};

export default BlockSavePage;
