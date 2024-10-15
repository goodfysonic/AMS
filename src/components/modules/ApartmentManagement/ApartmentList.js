import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchOutlined, FileExcelOutlined, PlusOutlined } from '@ant-design/icons';

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.get(`${API_URL}/master/api/apartments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response:', response.data);
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      message.error('Failed to fetch apartments: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/master/apartments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Apartment deleted');
      fetchApartments();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      message.error('Failed to delete apartment: ' + error.message);
    }
  };

  const handleSearch = () => {
    if (searchText) {
      const filteredApartments = apartments.filter(apartment =>
        apartment.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setApartments(filteredApartments);
    } else {
      fetchApartments();
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'apartment_id', key: 'apartment_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Floor', dataIndex: 'floor.floor_number', key: 'floor' },
    { title: 'Area', dataIndex: 'area', key: 'area' },
    { title: 'Purchase price', dataIndex: 'purchase_price', key: 'purchase_price' },
    { title: 'Rental price', dataIndex: 'rental_price', key: 'rental_price' },
    { title: 'Rental type', dataIndex: 'rental_type', key: 'rental_type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/apartments/edit/${record.apartment_id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.apartment_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search Apartment"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            style={{ backgroundColor: '#469FD1', borderColor: '#469FD1' }}
          >
            Search
          </Button>
          <Button
            icon={<FileExcelOutlined />}
            onClick={() => message.info('Export Excel functionality not implemented')}
            style={{ color: '#469FD1', borderColor: '#469FD1' }}
          >
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/apartments/new')}
            style={{ backgroundColor: '#469FD1', borderColor: '#469FD1' }}
          >
            Add New
          </Button>
        </Space>
      </div>

      <Table
        dataSource={apartments}
        columns={columns}
        loading={loading}
        rowKey="apartment_id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default ApartmentList;