import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Tag, Spin, Typography, message, Row, Col, Divider, Popconfirm, Empty, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, HomeOutlined, DollarOutlined, ArrowRightOutlined, AreaChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { blockId, floorId } = useParams();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/master/api';

  const fetchApartments = useCallback(async () => {
    if (!floorId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/floors/${floorId}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartments(response.data || []);
      message.success('Apartments fetched successfully', 2);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      message.error('Failed to fetch apartments', 2);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, floorId]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const deleteApartment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/apartments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Apartment deleted successfully', 2);
      fetchApartments();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      message.error('Failed to delete apartment', 2);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      AVAILABLE: { color: '#52c41a', background: '#f6ffed', borderColor: '#b7eb8f' },
      SOLD: { color: '#fa8c16', background: '#fff7e6', borderColor: '#ffd591' }
    };
    return styles[status?.toUpperCase()] || { color: '#8c8c8c', background: '#f5f5f5', borderColor: '#d9d9d9' };
  };

  const filteredApartments = apartments.filter(apartment =>
    apartment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPrice = (status, saleInfo) => {
    if (status?.toUpperCase() === 'SOLD' || !saleInfo?.purchase_price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(saleInfo.purchase_price);
  };

  const ApartmentCard = ({ apartment }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-[300px] w-[300px] flex flex-col m-4">
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <Text strong className="text-lg">{apartment?.name}</Text>
          <Tag style={getStatusStyle(apartment?.status)} className="rounded-full px-3 py-0.5 text-xs font-medium">
            {apartment?.status}
          </Tag>
        </div>

        <div className="space-y-3 flex-grow">
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2.5 rounded-md">
              <AreaChartOutlined className="text-blue-500 text-base" />
              <Text className="text-gray-500 text-sm min-w-[50px]">Area:</Text>
              <Text strong className="ml-auto text-sm">{apartment?.area} sqm</Text>
            </div>

            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2.5 rounded-md">
              <DollarOutlined className="text-green-500 text-base" />
              <Text className="text-gray-500 text-sm min-w-[50px]">Price:</Text>
              <Text strong className="ml-auto text-sm">{renderPrice(apartment?.status, apartment?.sale_info)}</Text>
            </div>
          </div>

          <Divider className="my-2" />

          <div>
            <Text className="text-gray-500 text-sm mb-2 block">Services:</Text>
            {apartment?.service_details?.length ? (
              <div className="space-y-2 max-h-[80px] overflow-y-auto">
                {apartment.service_details.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-md">
                    <ArrowRightOutlined className="text-blue-400 text-sm flex-shrink-0" />
                    <Text className="text-sm truncate">{service?.service?.name}:</Text>
                    <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                      <Text className="text-sm">{service?.amount_of_using}</Text>
                      <Text className="text-sm">{service?.service?.unit}</Text>
                      <Text strong className="text-blue-500 text-sm">({renderPrice(apartment?.status, service)})</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 bg-gray-50 rounded-md">
                <Text type="secondary" className="text-sm">No services available</Text>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/blocks/${blockId}/floors/${floorId}/apartments/${apartment?.apartment_id}/edit`)}
            className="hover:scale-105 transition-all shadow h-8 text-xs w-full"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this apartment?"
            description="This action cannot be undone."
            onConfirm={() => deleteApartment(apartment?.apartment_id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
              className="hover:scale-105 transition-all shadow h-8 text-xs w-full"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={2} className="!mb-2 flex items-center gap-2">
              <HomeOutlined className="text-blue-500" />
              Apartment Management
            </Title>
            <Text type="secondary">Manage your property portfolio efficiently</Text>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search apartments..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
              size="large"
            />
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/blocks/${blockId}/floors/${floorId}/apartments/new`)}
              className="hover:scale-105 transition-all shadow-md"
            >
              Add New Apartment
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading apartments..." />
          </div>
        ) : !filteredApartments?.length ? (
          <Empty 
            description={
              <span>
                {searchTerm ? 'No apartments match your search' : 'No apartments found'}
              </span>
            }
            className="bg-white p-8 rounded-lg shadow-sm"
          />
        ) : (
          <Row gutter={[32, 32]} justify="start">
            {filteredApartments.map((apartment) => (
              <Col xs={24} sm={24} md={12} lg={8} key={apartment?.apartment_id}>
                <ApartmentCard apartment={apartment} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ApartmentList;
