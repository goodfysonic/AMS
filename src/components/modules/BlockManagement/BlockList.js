import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Collapse, List, Tag, Space, Spin, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusOutlined, 
  EditOutlined, 
  HomeOutlined,
  BuildOutlined,
  CaretRightOutlined 
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Title } = Typography;

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

      // Fetch floors for all blocks initially
      for (const block of response.data) {
        const floorsResponse = await axios.get(`${API_URL}/blocks/${block.block_id}/floors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFloors(prev => ({ 
          ...prev, 
          [block.block_id]: floorsResponse.data 
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
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
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={blockFloors}
        renderItem={(floor) => (
          <List.Item>
            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Floor {floor.floor_number}</span>
                  <Tag color={getFloorTypeColor(floor.floor_type)}>
                    {floor.floor_type}
                  </Tag>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/blocks/${blockId}/floors/edit/${floor.floor_id}`)}
                >
                  Edit
                </Button>,
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  onClick={() => navigate(`/floors/${floor.floor_id}/apartments/`)}
                >
                View Apartments
                </Button>
              ]}
            >
              <Card.Meta description={`Floor Type: ${floor.floor_type}`} />
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
            const floorCount = blockFloors.length;
            
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
                <Collapse
                  expandIcon={({ isActive }) => 
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  }
                  activeKey={activeKey}
                  onChange={(keys) => setActiveKey(keys)}
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