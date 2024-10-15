import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import BlockForm from './BlockForm';

const BlockSavePage = () => {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const { blockId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  const fetchBlock = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER1}/api/master/blocks/${blockId}`);
      setBlock(response.data);
    } catch (error) {
      message.error('Failed to fetch block');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (blockId) {
        await axios.put(`${process.env.REACT_APP_SERVER1}/api/master/blocks/${blockId}`, values);
        message.success('Block updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_SERVER1}/api/master/blocks`, values);
        message.success('Block added successfully');
      }
      navigate('/blocks');
    } catch (error) {
      message.error('Failed to save block');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{blockId ? 'Edit Block' : 'Add New Block'}</h2>
      <BlockForm onSubmit={handleSubmit} initialValues={block || {}} />
    </div>
  );
};

export default BlockSavePage;
