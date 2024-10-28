import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import BlockForm from './BlockForm';

const BlockSavePage = () => {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { blockId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER || 'http://localhost:8080';

  useEffect(() => {
    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  const fetchBlock = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/master/api/blocks/${blockId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlock(response.data);
    } catch (error) {
      message.error('Failed to fetch block');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      let blockData = {
        name: values.name,
        description: values.description,
        total_apartment: values.total_apartment,
        total_floor: values.total_floor,
        floor: [], // Tạo mảng floor với apartments trống
      };

      // Tạo danh sách tầng và căn hộ mặc định
      for (let i = 1; i <= values.total_floor; i++) {
        let apartments = [];
        for (let j = 1; j <= values.total_apartment / values.total_floor; j++) {
          apartments.push({
            name: `Apartment ${i}-${j}`,
            area: 0,
            sale_info: {
              purchase_price: 0,
              sale_date: null
            },
            status: 'AVAILABLE',
            service_details: [],
            owner: null,
            residents: [],
            create_date: new Date().toISOString(),
            update_date: new Date().toISOString()
          });
        }
        blockData.floor.push({
          floor_number: i,
          floor_type: 'RESIDENTIAL',
          apartments: apartments,
          create_date: new Date().toISOString(),
          update_date: new Date().toISOString()
        });
      }

      let response;
      if (blockId) {
        // Cập nhật block
        response = await axios.put(`${API_URL}/master/api/blocks/${blockId}`, blockData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Block updated successfully');
      } else {
        // Tạo block mới
        response = await axios.post(`${API_URL}/master/api/blocks`, blockData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Block added successfully');
      }

      // Kiểm tra nếu response trả về block_id
      if (response.data && response.data.block_id) {
        const updatedBlock = await axios.get(`${API_URL}/master/api/blocks/${response.data.block_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlock(updatedBlock.data); // Cập nhật block trong state
      }

      navigate('/blocks'); // Điều hướng về trang danh sách block
    } catch (error) {
      message.error('Failed to save block');
    } finally {
      setSaving(false);
    }
  };

  if (blockId && loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>{blockId ? 'Edit Block' : 'Add New Block'}</h2>
      <BlockForm onFinish={handleSubmit} initialValues={block || {}} loading={saving} />
    </div>
  );
};

export default BlockSavePage;
