import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Card, Typography, Space, Tag, Tooltip, message } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const RenterList = () => {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/master/api/renters';

  const fetchRenters = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRenters(response.data.items || []);
      message.success('Renters fetched successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        message.error('Failed to fetch renters');
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, navigate]);

  useEffect(() => {
    fetchRenters();
  }, [fetchRenters]);

  const columns = [
    { title: 'Renter ID', dataIndex: 'renter_id', key: 'renter_id' },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => navigate(`/residents/renters/view/${record.renter_id}`)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => navigate(`/residents/renters/edit/${record.renter_id}`)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={() => message.info('Delete functionality not yet implemented')} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    if (searchText) {
      const filteredRenters = renters.filter((renter) =>
        renter.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        renter.last_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setRenters(filteredRenters);
    } else {
      fetchRenters();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Renter Management</Title>
        <Space>
          <Input.Search
            placeholder="Search renters..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/residents/renters/new')}>
            Add Renter
          </Button>
        </Space>
      </div>
      <Card className="shadow-sm rounded-lg">
        <Table
          columns={columns}
          dataSource={renters}
          loading={loading}
          rowKey="renter_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>
    </div>
  );
};

export default RenterList;
