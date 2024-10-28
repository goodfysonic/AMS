import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  message,
  Space,
  Input,
  Typography,
  Tag,
  Tooltip,
  Drawer,
  Descriptions,
  Divider,
} from "antd";
import axios from "axios";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const API_URL = "http://localhost:8080/master/api/households";

  const fetchHouseholds = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Token is missing. Please log in again.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouseholds(response.data || []);
      message.success("Households fetched successfully");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
      } else {
        message.error("Failed to fetch households");
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const handleSearch = () => {
    if (searchText) {
      const filteredHouseholds = households.filter((household) =>
        household.household_id.toLowerCase().includes(searchText.toLowerCase())
      );
      setHouseholds(filteredHouseholds);
    } else {
      fetchHouseholds();
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const showHouseholdDetails = (record) => {
    setSelectedHousehold(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Household ID",
      dataIndex: "household_id",
      key: "household_id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Total Members",
      dataIndex: "total_member",
      key: "total_member",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showHouseholdDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => message.info("Edit functionality not yet implemented")}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          Household Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search household ID..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info("Add functionality not yet implemented")}
          >
            Add New Household
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={households}
          columns={columns}
          loading={loading}
          rowKey="household_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} households`,
          }}
        />
      </Card>

      <Drawer
        title="Household Details"
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedHousehold && (
          <>
            <Descriptions
              title="Household Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold", width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              <Descriptions.Item label="Household ID">
                {selectedHousehold.household_id}
              </Descriptions.Item>
              <Descriptions.Item label="Total Members">
                {selectedHousehold.total_member}
              </Descriptions.Item>
              <Descriptions.Item label="Creation Date">
                {formatDate(selectedHousehold.create_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Update Date">
                {formatDate(selectedHousehold.update_date)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions
              title="Residents Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold", width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              {selectedHousehold.residents.map((resident, index) => (
                <React.Fragment key={resident.owner_id}>
                  <Descriptions.Item label="Full Name">
                    {`${resident.first_name} ${resident.middle_name || ""} ${resident.last_name}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone Number">
                    {resident.phone_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {resident.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Career">
                    {resident.career}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID Card Number">
                    {resident.id_card_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Date">
                    {formatDate(resident.birth_day)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Household Head">
                    <Tag color={resident.household_head ? "green" : "red"}>
                      {resident.household_head ? "Yes" : "No"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {`${resident.street}, ${resident.ward}, ${resident.district}, ${resident.city}`}
                  </Descriptions.Item>
                  <Divider />
                </React.Fragment>
              ))}
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default HouseholdList;
