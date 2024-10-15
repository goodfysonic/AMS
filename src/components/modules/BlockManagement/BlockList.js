import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER1}/api/master/blocks`);
      setBlocks(response.data);
    } catch (error) {
      message.error('Failed to fetch blocks');
    }
    setLoading(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'block_id', key: 'block_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Number of Floors', dataIndex: 'total_floor', key: 'total_floor' },
    { title: 'Number of Apartments', dataIndex: 'total_apartment', key: 'total_apartment' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/blocks/edit/${record.block_id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.block_id)}>Delete</Button>
        </>
      ),
    },
  ];

  const handleDelete = async (blockId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER1}/api/master/blocks/${blockId}`);
      message.success('Block deleted');
      fetchBlocks();
    } catch (error) {
      message.error('Failed to delete block');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => navigate('/blocks/new')}>Add New Block</Button>
      <Table dataSource={blocks} columns={columns} loading={loading} rowKey="block_id" />
    </div>
  );
};

export default BlockList;
