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

  // Sử dụng đúng biến môi trường
  const API_URL = process.env.REACT_APP_SERVER1;

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await axios.get(`${API_URL}/api/master/apartments`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      setApartments(response.data); // Gán dữ liệu căn hộ từ API
    } catch (error) {
      message.error('Failed to fetch apartments');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/master/apartments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      message.success('Apartment deleted');
      fetchApartments();
    } catch (error) {
      message.error('Failed to delete apartment');
    }
  };

  const handleSearch = () => {
    if (searchText) {
      const filteredApartments = apartments.filter(apartment =>
        apartment.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setApartments(filteredApartments);
    } else {
      fetchApartments(); // Nếu không có tìm kiếm, load lại danh sách
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Floor', dataIndex: 'floor', key: 'floor' },
    { title: 'Area', dataIndex: 'area', key: 'area' },
    { title: 'Purchase price', dataIndex: 'purchasePrice', key: 'purchasePrice' },
    { title: 'Rental price', dataIndex: 'rentalPrice', key: 'rentalPrice' },
    { title: 'Rental type', dataIndex: 'rentalType', key: 'rentalType' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/apartments/edit/${record.id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Apartment"
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
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default ApartmentList;
