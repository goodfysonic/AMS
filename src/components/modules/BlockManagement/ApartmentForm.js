import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const ApartmentForm = ({ onSubmit, initialValues = {} }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields(); // Xóa các trường đã nhập
    navigate('/apartments'); // Điều hướng trở lại trang danh sách căn hộ
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter apartment name' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Purchase price"
              name="purchasePrice"
              rules={[{ required: true, message: 'Please enter purchase price' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Rental price"
              name="rentalPrice"
              rules={[{ required: true, message: 'Please enter rental price' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Floor"
              name="floor"
              rules={[{ required: true, message: 'Please enter floor' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Area"
              name="area"
              rules={[{ required: true, message: 'Please enter area' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Rental type"
              name="rentalType"
              rules={[{ required: true, message: 'Please select rental type' }]}
            >
              <Select>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Apartment status"
              name="status"
              rules={[{ required: true, message: 'Please select apartment status' }]}
            >
              <Select>
                <Option value="available">Available</Option>
                <Option value="rented">Rented</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-center">
          <Button
            type="default"
            style={{ backgroundColor: '#469FD1', color: 'white', border: 'none' }}
            className="mr-4"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: '#469FD1', borderColor: '#469FD1' }}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApartmentForm;
