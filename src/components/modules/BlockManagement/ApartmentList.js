import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Tag,
  Spin,
  Typography,
  message,
  Row,
  Col,
  Popconfirm,
  Empty,
  Input,
  Menu,
  Dropdown,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  EyeOutlined,
  FileAddOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ContainerOutlined,
  HomeOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/master/api";

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { blockId, floorId } = useParams();


  const fetchApartments = useCallback(async () => {
    if (!floorId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/floors/${floorId}/apartments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApartments(response.data || []);
      message.success("Apartments fetched successfully", 2);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      message.error("Failed to fetch apartments", 2);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [floorId]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const deleteApartment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/apartments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Apartment deleted successfully", 2);
      fetchApartments();
    } catch (error) {
      console.error("Error deleting apartment:", error);
      message.error("Failed to delete apartment", 2);
    }
  };

  const getStatusStyle = (status) =>
    status === "AVAILABLE" ? { color: "#52c41a" } : { color: "#fa8c16" };

  const renderPrice = (status, saleInfo) => {
    if (status === "SOLD" || !saleInfo?.purchase_price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(saleInfo.purchase_price);
  };

  const ApartmentCard = ({ apartment }) => {
    const isAvailable = apartment?.status?.toUpperCase() === "AVAILABLE";

    const menu = (
      <Menu>
        <Menu.Item
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(
              `/blocks/${blockId}/floors/${floorId}/apartments/${apartment.apartment_id}/edit`
            )
          }
        >
          View details
        </Menu.Item>

        {isAvailable ? (
          <>
            <Menu.Item
              icon={<FileAddOutlined />}
              onClick={() => navigate(`/contracts/new`)}
            >
              Create contract
            </Menu.Item>
            <Menu.Item danger icon={<DeleteOutlined />}>
              <Popconfirm
                title="Delete this apartment?"
                onConfirm={() => deleteApartment(apartment?.apartment_id)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                Delete
              </Popconfirm>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/invoices/new`)}
            >
              Create invoice
            </Menu.Item>
            <Menu.Item
              icon={<ContainerOutlined />}
              onClick={() => navigate(`/rental-records/new`)}
            >
              Create rental record
            </Menu.Item>
          </>
        )}
      </Menu>
    );

    return (
      <Card
        className="transform transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4 flex justify-between items-start">
          <Text strong className="text-lg">
            {apartment?.name}
          </Text>
          <Tag style={getStatusStyle(apartment?.status)}>
            {apartment?.status}
          </Tag>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>

        <div className="px-4 pb-4">
          <Title level={5} className="mb-3 text-gray-600">
            Detail info:
          </Title>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <Text>Purchase price:</Text>
              <Text strong>
                {renderPrice(apartment?.status, apartment?.sale_info)}
              </Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Area:</Text>
              <Text strong>{apartment?.area} sqm</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Furniture:</Text>
              <Text strong>{apartment?.furniture ? "Yes" : "No"}</Text>
            </div>
          </div>
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
            <Input
              placeholder="Search apartments..."
              prefix={<PlusOutlined />}
              className="w-full sm:w-64"
              size="large"
            />
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(`/blocks/${blockId}/floors/${floorId}/apartments/new`)
              }
            >
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
    </div>
  );
};

export default ApartmentList;
