import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, List, Tag, Space, Spin, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { floorId } = useParams();

  const API_URL = 'http://localhost:8080/master/api'; 

  // Fetch apartments by floorId
  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/floors/${floorId}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartments(response.data);
      message.success('Apartments fetched successfully');
    } catch (error) {
      console.error('Error fetching apartments:', error);
      message.error('Failed to fetch apartments');
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
      message.success('Apartment deleted successfully');
      fetchApartments();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      message.error('Failed to delete apartment');
    }
  };

  const getApartmentStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE': return 'green';
      case 'RENTED': return 'red';
      case 'SOLD': return 'orange';
      default: return 'default';
    }
  };

  const renderApartmentRow = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={apartments}
        renderItem={apartment => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/apartments/${apartment.apartment_id}/edit`)}
              >
                Edit
              </Button>,
              <Button 
                type="danger" 
                icon={<DeleteOutlined />} 
                onClick={() => deleteApartment(apartment.apartment_id)}
              >
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              title={`Apartment ${apartment.name || 'undefined'}`}
              description={
                <>
                  <div>Area: {apartment.area} sqm</div>
                  <div>Rental Price: ${apartment.rental_info?.rental_price || 'N/A'}</div>
                  <Tag color={getApartmentStatusColor(apartment.status)}>
                    {apartment.status}
                  </Tag>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Title level={4}>Apartment List</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/apartments/new')}
        >
          Add New Apartment
        </Button>
      </div>
      {loading ? (
        <Spin tip="Loading apartments..." />
      ) : (
        renderApartmentRow()
      )}
    </div>
  );
};

export default ApartmentList;
