import React, { useEffect, useState, useCallback } from 'react';
import { Card, Table, Button, message, Space, Input, Typography, Tag, Tooltip, Drawer, Descriptions, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/identity/api';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.items);
      message.success('Users fetched successfully');
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    if (searchText) {
      const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      fetchUsers();
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const showUserDetails = (record) => {
    setSelectedUser(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <span className="font-medium">{text}</span>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: ['user_info', 'email'],
      key: 'email',
    },
    {
      title: 'Country',
      dataIndex: ['user_info', 'country'],
      key: 'country',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Role',
      dataIndex: ['role', 'label'],
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/users/edit/${record.user_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={() => message.info('Delete functionality not yet implemented')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8 gap-4">
        <Title level={2} className="flex items-center gap-2 !mb-0 text-2xl">
          <UserOutlined className="text-3xl" /> User Management
        </Title>
        <Space size="middle">
          <Input.Search
            placeholder="Search user..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/new')}
            size="large"
          >
            Add New User
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={users}
          columns={columns}
          loading={loading}
          rowKey="user_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          size="large"
        />
      </Card>

      <Drawer
        title="User Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUser && (
          <div className="space-y-6">
            <Descriptions title="User Information" bordered>
              <Descriptions.Item label="User ID" span={3}>
                {selectedUser.user_id}
              </Descriptions.Item>
              <Descriptions.Item label="Username" span={3}>
                {selectedUser.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedUser.user_info.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                {selectedUser.user_info.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={3}>
                {selectedUser.user_info.country}
              </Descriptions.Item>
              <Descriptions.Item label="Role" span={3}>
                {selectedUser.role.label}
              </Descriptions.Item>
            </Descriptions>

            <Timeline items={[
              {
                label: 'Created At',
                children: formatDate(selectedUser.created_at),
              },
              {
                label: 'Last Updated',
                children: formatDate(selectedUser.updated_at),
              }
            ]} />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserList;
