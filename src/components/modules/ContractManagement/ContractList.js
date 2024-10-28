import React, { useEffect, useState, useCallback } from 'react';
import { Card, Table, Button, message, Space, Input, Typography, Tag, Tooltip, Drawer, Descriptions, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditOutlined, PlusOutlined, SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/master/api';

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts(response.data.items || []);
      message.success('Contracts fetched successfully');
    } catch (error) {
      message.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleSearch = () => {
    if (searchText) {
      const filteredContracts = contracts.filter(contract =>
        contract.apartment.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setContracts(filteredContracts);
    } else {
      fetchContracts();
    }
  };

  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');

  const showContractDetails = (record) => {
    setSelectedContract(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Contract ID',
      dataIndex: 'contract_id',
      key: 'contract_id',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => formatDate(date),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
              onClick={() => showContractDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/contracts/edit/${record.contract_id}`)}
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          Contract Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search contract..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/contracts/new')}
          >
            Add New Contract
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={contracts}
          columns={columns}
          loading={loading}
          rowKey="contract_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Drawer
        title="Contract Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedContract && (
          <div className="space-y-6">
            <Descriptions title="Contract Information" bordered>
              <Descriptions.Item label="Contract ID" span={3}>
                {selectedContract.contract_id}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date" span={3}>
                {formatDate(selectedContract.start_date)}
              </Descriptions.Item>
              <Descriptions.Item label="End Date" span={3}>
                {formatDate(selectedContract.end_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                {selectedContract.status}
              </Descriptions.Item>
              <Descriptions.Item label="Type" span={3}>
                {selectedContract.type}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Apartment Information" bordered>
              <Descriptions.Item label="Apartment ID" span={3}>
                {selectedContract.apartment.apartment_id}
              </Descriptions.Item>
              <Descriptions.Item label="Apartment Name" span={3}>
                {selectedContract.apartment.name}
              </Descriptions.Item>
              <Descriptions.Item label="Area" span={3}>
                {selectedContract.apartment.area} m²
              </Descriptions.Item>
              {selectedContract.apartment.rental_info && (
                <>
                  <Descriptions.Item label="Rental Price" span={3}>
                    {selectedContract.apartment.rental_info.rental_price} VND
                  </Descriptions.Item>
                  <Descriptions.Item label="Rental Type" span={3}>
                    {selectedContract.apartment.rental_info.rental_type}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rental Start Date" span={3}>
                    {formatDate(selectedContract.apartment.rental_info.rental_start_date)}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>

            <Timeline mode="left">
              <Timeline.Item label="Created At">
                {formatDate(selectedContract.create_date)}
              </Timeline.Item>
              <Timeline.Item label="Last Updated">
                {formatDate(selectedContract.update_date)}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ContractList;
