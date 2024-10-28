import React, { useEffect, useState, useCallback } from 'react';
import { Card, Table, Button, message, Space, Input, Typography, Tag, Tooltip, Drawer, Descriptions, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditOutlined, PlusOutlined, SearchOutlined, DeleteOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/master/api';

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
      message.success('Services fetched successfully');
    } catch (error) {
      message.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = () => {
    if (searchText) {
      const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setServices(filteredServices);
    } else {
      fetchServices();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const showServiceDetails = (record) => {
    setSelectedService(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="font-medium">{text}</span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit'
    },
    {
      title: 'Metered Service',
      dataIndex: 'meteredService',
      key: 'meteredService',
      render: (metered) => (
        <Tag color={metered ? 'green' : 'blue'}>
          {metered ? 'Metered' : 'Non-Metered'}
        </Tag>
      ),
      filters: [
        { text: 'Metered', value: true },
        { text: 'Non-Metered', value: false },
      ],
      onFilter: (value, record) => record.meteredService === value,
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
              onClick={() => showServiceDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/services/edit/${record.service_id}`)}
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
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <ToolOutlined /> Service Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search service..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/services/new')}
          >
            Add New Service
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={services}
          columns={columns}
          loading={loading}
          rowKey="service_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </Card>

      <Drawer
        title="Service Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {selectedService && (
          <div className="space-y-6">
            <Descriptions title="Service Information" bordered>
              <Descriptions.Item label="Service ID" span={3}>
                {selectedService.service_id}
              </Descriptions.Item>
              <Descriptions.Item label="Name" span={3}>
                {selectedService.name}
              </Descriptions.Item>
              <Descriptions.Item label="Price" span={3}>
                {formatPrice(selectedService.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Unit" span={3}>
                {selectedService.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Service Type" span={3}>
                <Tag color={selectedService.meteredService ? 'green' : 'blue'}>
                  {selectedService.meteredService ? 'Metered' : 'Non-Metered'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Timeline mode="left">
              <Timeline.Item label="Created At">
                {formatDate(selectedService.create_date)}
              </Timeline.Item>
              <Timeline.Item label="Last Updated">
                {formatDate(selectedService.update_date)}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ServiceList;
