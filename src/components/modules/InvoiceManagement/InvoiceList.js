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
  Timeline,
  Modal,
  Form,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [serviceDetailModal, setServiceDetailModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [services, setServices] = useState([]);
  const [apartments, setApartments] = useState([]);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/master/api";

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(response.data.items);
      message.success("Invoices fetched successfully");
    } catch (error) {
      message.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchServicesAndApartments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const serviceRes = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(serviceRes.data.items);

      const apartmentRes = await axios.get(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartments(apartmentRes.data.items);
    } catch (error) {
      message.error("Failed to fetch services or apartments");
    }
  }, [API_URL]);

  useEffect(() => {
    fetchInvoices();
    fetchServicesAndApartments();
  }, [fetchInvoices, fetchServicesAndApartments]);

  const handleSearch = () => {
    if (searchText) {
      const filteredInvoices = invoices.filter((invoice) =>
        invoice.apartment.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setInvoices(filteredInvoices);
    } else {
      fetchInvoices();
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
  };

  const addServiceDetail = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/service_details`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Service detail added successfully");
      fetchInvoices(); // Refresh invoices after addition
      setServiceDetailModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add service detail");
    }
  };

  const updateServiceDetail = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/service_details/${selectedServiceDetail.service_detail_id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Service detail updated successfully");
      fetchInvoices(); // Refresh invoices after update
      setServiceDetailModal(false);
      form.resetFields();
      setSelectedServiceDetail(null);
    } catch (error) {
      message.error("Failed to update service detail");
    }
  };

  const deleteServiceDetail = async (serviceDetailId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/service_details/${serviceDetailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Service detail deleted successfully");
      fetchInvoices(); // Refresh invoices after deletion
    } catch (error) {
      message.error("Failed to delete service detail");
    }
  };

  const showInvoiceDetails = (record) => {
    setSelectedInvoice(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Apartment",
      dataIndex: ["apartment", "name"],
      key: "apartment_name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total) => formatPrice(total),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Payment Deadline",
      dataIndex: "payment_deadline",
      key: "payment_deadline",
      render: (date) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.payment_deadline) - new Date(b.payment_deadline),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "PAID", value: "PAID" },
        { text: "PENDING", value: "PENDING" },
        { text: "OVERDUE", value: "OVERDUE" },
      ],
      onFilter: (value, record) => record.status === value,
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
              onClick={() => showInvoiceDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/invoices/edit/${record.invoice_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={() =>
                message.info("Delete functionality not yet implemented")
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const ServiceDetailsTable = ({ serviceDetails }) => (
    <Table
      dataSource={serviceDetails}
      rowKey="service_detail_id"
      pagination={false}
      columns={[
        {
          title: "Service",
          dataIndex: ["service", "name"],
          key: "service_name",
        },
        {
          title: "Old Value",
          dataIndex: "old_value",
          key: "old_value",
        },
        {
          title: "New Value",
          dataIndex: "new_value",
          key: "new_value",
        },
        {
          title: "Amount Used",
          dataIndex: "amount_of_using",
          key: "amount_used",
        },
        {
          title: "Unit",
          dataIndex: ["service", "unit"],
          key: "unit",
        },
        {
          title: "Price",
          dataIndex: ["service", "price"],
          key: "price",
          render: (price) => formatPrice(price),
        },
        {
          title: "Total",
          dataIndex: "money",
          key: "money",
          render: (money) => formatPrice(money),
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => {
                  setSelectedServiceDetail(record);
                  form.setFieldsValue(record);
                  setServiceDetailModal(true);
                }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => deleteServiceDetail(record.service_detail_id)}
              />
            </Space>
          ),
        },
      ]}
    />
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <FileTextOutlined /> Invoice Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search apartment..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/invoices/new")}
          >
            Add New Invoice
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={invoices}
          columns={columns}
          loading={loading}
          rowKey="invoice_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Drawer
        title="Invoice Details"
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <Descriptions
              title="Invoice Information"
              bordered
              column={1}
              labelStyle={{ width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              <Descriptions.Item label="Invoice ID">
                {selectedInvoice.invoice_id}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {formatPrice(selectedInvoice.total)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Deadline">
                {formatDate(selectedInvoice.payment_deadline)}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Apartment Information"
              bordered
              column={1}
              labelStyle={{ width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              <Descriptions.Item label="Name">
                {selectedInvoice.apartment.name}
              </Descriptions.Item>
              <Descriptions.Item label="Area">
                {selectedInvoice.apartment.area} m²
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedInvoice.apartment.status === "AVAILABLE"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedInvoice.apartment.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Rental Information"
              bordered
              column={1}
              labelStyle={{ width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              <Descriptions.Item label="Rental Price">
                {formatPrice(
                  selectedInvoice.apartment.rental_info.rental_price
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Rental Type">
                {selectedInvoice.apartment.rental_info.rental_type}
              </Descriptions.Item>
              <Descriptions.Item label="Rental Start Date">
                {formatDate(
                  selectedInvoice.apartment.rental_info.rental_start_date
                )}
              </Descriptions.Item>
            </Descriptions>

            <Card
              title="Service Details"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedServiceDetail(null);
                    form.resetFields();
                    setServiceDetailModal(true);
                  }}
                >
                  Add Service Detail
                </Button>
              }
            >
              <ServiceDetailsTable
                serviceDetails={selectedInvoice.apartment.service_details}
              />
            </Card>

            <Timeline mode="left">
              <Timeline.Item label="Created At">
                {formatDate(selectedInvoice.create_date)}
              </Timeline.Item>
              <Timeline.Item label="Last Updated">
                {formatDate(selectedInvoice.update_date)}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>

      <Modal
        title={
          selectedServiceDetail ? "Edit Service Detail" : "Add Service Detail"
        }
        open={serviceDetailModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setServiceDetailModal(false);
          setSelectedServiceDetail(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={
            selectedServiceDetail ? updateServiceDetail : addServiceDetail
          }
        >
          <Form.Item
            name="service_id"
            label="Service"
            rules={[{ required: true, message: "Please select a service!" }]}
          >
            <Select placeholder="Select a service">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <Option key={service.service_id} value={service.service_id}>
                    {service.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No services available</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="new_value"
            label="New Value"
            rules={[{ required: true, message: "Please input new value!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="old_value"
            label="Old Value"
            rules={[{ required: true, message: "Please input old value!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="apartment_id"
            label="Apartment"
            rules={[{ required: true, message: "Please select an apartment!" }]}
          >
            <Select placeholder="Select an apartment">
              {apartments && apartments.length > 0 ? (
                apartments.map((apartment) => (
                  <Option
                    key={apartment.apartment_id}
                    value={apartment.apartment_id}
                  >
                    {apartment.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No apartments available</Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoiceList;
