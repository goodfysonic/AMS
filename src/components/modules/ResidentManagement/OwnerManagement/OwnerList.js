import React, { useEffect, useState, useCallback } from 'react';
import { Card, Table, Button, Input, Typography, Space, Tooltip, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/master/api/owners';

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOwners(response.data.items || []);
    } catch (error) {
      message.error('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const handleSearch = () => {
    if (searchText) {
      const filteredOwners = owners.filter(owner =>
        owner.first_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setOwners(filteredOwners);
    } else {
      fetchOwners();
    }
  };

  const columns = [
    {
      title: 'Owner ID',
      dataIndex: 'owner_id',
      key: 'owner_id',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/residents/owners/edit/${record.owner_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => message.info('Delete functionality not yet implemented')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 mb-0">
          Owner Management
        </Title>
        <Space>
          <Input
            placeholder="Search owner..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64"
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/residents/owners/new')}
          >
            Add Owner
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={owners}
          columns={columns}
          loading={loading}
          rowKey="owner_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{
            emptyText: (
              <div className="text-center">
                <img src="path/to/your/no-data-image.png" alt="No data" />
                <p className="mt-4">No data</p>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default OwnerList;
