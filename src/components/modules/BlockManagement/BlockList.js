import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/master/api/blocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlocks(response.data);
    } catch (error) {
      message.error('Failed to fetch blocks');                                                    
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const columns = [
    { title: 'Block Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Total Apartments', dataIndex: 'total_apartment', key: 'total_apartment' },
    { title: 'Total Floors', dataIndex: 'total_floor', key: 'total_floor' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/blocks/${record.block_id}/floors`)}>View Floors</Button>
          <Button onClick={() => navigate(`/blocks/edit/${record.block_id}`)}>Edit Block</Button>
        </Space>
      ),
    },
  ];  

  return (
    <div>
      <Button type="primary" onClick={() => navigate('/blocks/new')} style={{ marginBottom: 16 }}>
        Add New Block
      </Button>
      <Table 
        dataSource={blocks} 
        columns={columns} 
        loading={loading} 
        rowKey="block_id" 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BlockList;
