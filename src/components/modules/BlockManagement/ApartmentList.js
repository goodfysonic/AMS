import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Tag, Spin, Typography, message, Row, Col, Divider, Popconfirm, Empty, Input, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined, EyeOutlined, FileAddOutlined, DeleteOutlined, FileTextOutlined, ContainerOutlined, AreaChartOutlined, DollarOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/master/api';

const ApartmentList = () => {
  // State Management
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const navigate = useNavigate();
  const { blockId, floorId } = useParams();

  // Data Fetching
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
  }, [floorId]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  // Helper Functions
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

  const getStatusStyle = (status) => (status === 'AVAILABLE' ? { color: '#52c41a' } : { color: '#fa8c16' });

  const renderPrice = (status, saleInfo) => {
    if (status === 'SOLD' || !saleInfo?.purchase_price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(saleInfo.purchase_price);
  };

  // UI Components
  const ApartmentCard = ({ apartment }) => {
    const isAvailable = apartment?.status?.toUpperCase() === 'AVAILABLE';

    return (
      <Card className="transform transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden" bodyStyle={{ padding: 0 }}>
        {/* Card Header */}
        <div className="p-4 flex justify-between items-start">
          <Text strong className="text-lg">{apartment?.name}</Text>
          <Tag style={getStatusStyle(apartment?.status)}>{apartment?.status}</Tag>
        </div>

        {/* Apartment Details */}
        <div className="px-4 pb-4">
          <Title level={5} className="mb-3 text-gray-600">Detail info:</Title>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <Text>Purchase price:</Text>
              <Text strong>{renderPrice(apartment?.status, apartment?.sale_info)}</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Area:</Text>
              <Text strong>{apartment?.area} sqm</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Furniture:</Text>
              <Text strong>{apartment?.furniture ? 'Yes' : 'No'}</Text>
            </div>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Card Actions */}
        <div className="bg-gray-50 p-4 space-y-2">
          {isAvailable ? (
            <>
              <Button type="link" icon={<EyeOutlined />} onClick={() => setSelectedApartment(apartment) || setIsDetailModalVisible(true)}>
                View details
              </Button>
              <Button type="link" icon={<FileAddOutlined />} onClick={() => navigate(`/blocks/${blockId}/floors/${floorId}/apartments/${apartment?.apartment_id}/contract`)}>
                Create contract
              </Button>
              <Popconfirm
                title="Delete this apartment?"
                onConfirm={() => deleteApartment(apartment?.apartment_id)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
              </Popconfirm>
            </>
          ) : (
            <>
              <Button type="link" icon={<EyeOutlined />} onClick={() => setSelectedApartment(apartment) || setIsDetailModalVisible(true)}>
                View details
              </Button>
              <Button type="link" icon={<FileTextOutlined />}>Create invoice</Button>
              <Button type="link" icon={<ContainerOutlined />}>Create rental record</Button>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 sm:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Title level={2} className="flex items-center gap-2">
            <HomeOutlined className="text-blue-500" />
            Apartment Management
          </Title>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search apartments..." prefix={<SearchOutlined />} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64" size="large" />
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate(`/blocks/${blockId}/floors/${floorId}/apartments/new`)}>
              Add New Apartment
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading apartments..." />
          </div>
        ) : !apartments.length ? (
          <Empty description="No apartments found" className="my-16" />
        ) : (
          <Row gutter={[24, 24]}>
            {apartments.map((apartment) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={apartment?.apartment_id}>
                <ApartmentCard apartment={apartment} />
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Modal
        title={<Text strong className="text-xl">Apartment Details - {selectedApartment?.name}</Text>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Text>Status:</Text>
            <Tag style={getStatusStyle(selectedApartment?.status)}>{selectedApartment?.status}</Tag>
          </div>
          <div className="flex items-center gap-4">
            <Text>Price:</Text>
            <Text strong>{renderPrice(selectedApartment?.status, selectedApartment?.sale_info)}</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApartmentList;
