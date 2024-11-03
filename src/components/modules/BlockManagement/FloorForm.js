import React from 'react';
import { Form, InputNumber, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FloorForm = ({ initialValues, onFinish, loading, blockId, onAddFloor }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');

      // Thêm blockId vào payload
      const payload = {
        ...values,
        block_id: blockId,
      };

      const response = await axios.post(`http://localhost:8080/master/api/floors`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Floor added successfully');
      form.resetFields();
      
      // Gọi callback để cập nhật danh sách tầng trong BlockList
      if (onAddFloor) {
        onAddFloor(response.data);
      }

      if (onFinish) {
        onFinish();
      }
    } catch (error) {
      message.error('Failed to add floor');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="floor_number"
        label="Floor Number"
        rules={[{ required: true, message: 'Please input floor number!' }]}
      >
        <InputNumber min={1} placeholder="Enter floor number" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="floor_type"
        label="Floor Type"
        rules={[{ required: true, message: 'Please select floor type!' }]}
      >
        <Select placeholder="Select floor type" style={{ width: '100%' }}>
          <Option value="RESIDENTIAL">Resident</Option>
          <Option value="COMMERCIAL">Commercial</Option>
          <Option value="TECHNICAL">Technical</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FloorForm;
