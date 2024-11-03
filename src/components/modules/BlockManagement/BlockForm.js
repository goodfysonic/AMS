import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

const BlockForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description!' }]}
      >
        <Input placeholder="Enter block description" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the block name!' }]}
      >
        <Input placeholder="Enter block name" />
      </Form.Item>

      <Form.Item
        name="total_floor"
        label="Total Floors"
        rules={[{ required: true, message: 'Please enter the total number of floors!' }]}
      >
        <InputNumber min={1} placeholder="Enter total floors" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="apartment_per_floor"
        label="Apartments Per Floor"
        rules={[{ required: true, message: 'Please enter the number of apartments per floor!' }]}
      >
        <InputNumber min={1} placeholder="Enter apartments per floor" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlockForm;