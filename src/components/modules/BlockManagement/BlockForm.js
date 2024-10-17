import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

const BlockForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();

  // Đảm bảo rằng initialValues được set cho form
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}  
    >
      <Form.Item
        name="name"
        label="Block Name"
        rules={[{ required: true, message: 'Please input block name!' }]}
      >
        <Input placeholder="Enter block name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea rows={4} placeholder="Enter description" />
      </Form.Item>

      <Form.Item
        name="total_apartment"
        label="Total Apartments"
        rules={[{ required: true, message: 'Please input total apartments!' }]}
      >
        <InputNumber min={0} placeholder="Enter total apartments" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="total_floor"
        label="Total Floors"
        rules={[{ required: true, message: 'Please input total floors!' }]}
      >
        <InputNumber min={0} placeholder="Enter total floors" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlockForm;
