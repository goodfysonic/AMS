import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FloorList = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { blockId } = useParams();  // Lấy blockId từ URL

  const BASE_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';
  const API_URL = `${BASE_URL}/master/api`;  

  const fetchFloors = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/blocks/${blockId}/floors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFloors(response.data);  
      message.success('Floors fetched successfully');
    } catch (error) {
      message.error('Failed to fetch floors');
    } finally {
      setLoading(false);
    }
  }, [API_URL, blockId]);

  useEffect(() => {
    if (blockId) {
      fetchFloors();  
    }
  }, [fetchFloors, blockId]);

  const columns = [
    { title: 'Floor Number', dataIndex: 'floor_number', key: 'floor_number' },
    { title: 'Floor Type', dataIndex: 'floor_type', key: 'floor_type' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/blocks/${blockId}/floors/edit/${record.floor_id}`)}>Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => navigate(`/blocks/${blockId}/floors/new`)} style={{ marginBottom: 16 }}>
        Add New Floor
      </Button>
      <Table 
        dataSource={floors} 
        columns={columns} 
        loading={loading} 
        rowKey="floor_id" 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FloorList;
