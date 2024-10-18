import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Space, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditOutlined, PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/master/api';

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(response.data.items);
      message.success('Invoices fetched successfully');
    } catch (error) {
      message.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSearch = () => {
    if (searchText) {
      const filteredInvoices = invoices.filter(invoice => 
        invoice.apartment.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setInvoices(filteredInvoices);
    } else {
      fetchInvoices();
    }
  };

  const columns = [
    { title: 'Name', dataIndex: ['apartment', 'name'], key: 'apartment_name' },
    { title: 'Floor', dataIndex: ['apartment', 'floor'], key: 'floor' },
    { title: 'Area', dataIndex: ['apartment', 'area'], key: 'area' },
    { title: 'Purchase Price', dataIndex: ['apartment', 'sale_info', 'purchase_price'], key: 'purchase_price' },
    { title: 'Rental Price', dataIndex: ['rental_info', 'rental_price'], key: 'rental_price' },
    { title: 'Rental Type', dataIndex: ['rental_info', 'rental_type'], key: 'rental_type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/invoices/edit/${record.invoice_id}`)}
          />
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => message.info('Delete functionality not yet implemented')} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Invoice Management</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Input 
          placeholder="Invoice" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }} 
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/invoices/new')}
        >
          Add new
        </Button>
      </div>

      <Table
        dataSource={invoices}
        columns={columns}
        loading={loading}
        rowKey="invoice_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default InvoiceList;
