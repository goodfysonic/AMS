import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Collapse, List, Tag, Space, Spin, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, HomeOutlined, BuildOutlined, CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Panel } = Collapse;
const { Title, Text } = Typography;

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState([]);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/master/api';

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/blocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlocks(response.data);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchFloors = useCallback(async (blockId) => {
    try {
      const token = localStorage.getItem('token');
      const floorsResponse = await axios.get(`${API_URL}/blocks/${blockId}/floors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFloors(prev => ({ 
        ...prev, 
        [blockId]: floorsResponse.data 
      }));
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch floors');
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const getFloorTypeColor = (type) => {
    switch (type.toUpperCase()) {
      case 'COMMERCIAL': return 'blue';
      case 'RESIDENTIAL': return 'green';
      case 'TECHNICAL': return 'orange';
      default: return 'default';
    }
  };

  const renderFloorGrid = (blockFloors, blockId) => {
    return (
      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3 }}
        dataSource={blockFloors}
        renderItem={(floor) => (
          <List.Item>
            <Card 
              className="rounded-xl shadow-sm hover:shadow-md transition-all"
              bodyStyle={{ padding: '16px' }}
            >
              <div className="bg-blue-500 text-white p-4 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">Floor {floor.floor_number}</span>
                  <span className="bg-blue-400/50 px-3 py-1 rounded-full text-sm">
                    {floor.floor_type}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  type="text"
                  icon={<HomeOutlined className="text-blue-500" />}
                  onClick={() => navigate(`/blocks/${blockId}/floors/${floor.floor_id}/apartments/`)}
                  className="w-full text-blue-500 hover:text-blue-600 border border-blue-500 rounded-lg flex items-center justify-center gap-2"
                >
                  View Apartment
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px' 
      }}>
        <Title level={2} style={{ margin: 0 }}>
          <BuildOutlined /> Block Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/blocks/new')}
        >
          Add New Block
        </Button>
      </div>

      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {blocks.map((block) => {
            const blockFloors = floors[block.block_id] || [];
            const floorCount = block.total_floor; // Giữ lại số tầng ban đầu

            return (
              <Card 
                key={block.block_id}
                style={{ width: '100%' }}
                title={
                  <Space>
                    <span>{block.name}</span>
                    <Tag>{floorCount} Floors</Tag>
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/blocks/${block.block_id}/floors/new`)}
                  >
                    Add Floor
                  </Button>
                }
              >
                <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                  {block.description || 'No description available for this block.'}
                </Text>

                <Collapse
                  expandIcon={({ isActive }) => 
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  }
                  activeKey={activeKey}
                  onChange={(keys) => {
                    setActiveKey(keys);
                    if (keys.includes(block.block_id) && !floors[block.block_id]) {
                      fetchFloors(block.block_id);
                    }
                  }}
                >
                  <Panel 
                    key={block.block_id}
                    header={`View All ${floorCount} Floors`}
                    style={{ border: 'none' }}
                  >
                    {renderFloorGrid(blockFloors, block.block_id)}
                  </Panel>
                </Collapse>
              </Card>
            );
          })}
        </Space>
      </Spin>
    </div>
  );
};

export default BlockList;
