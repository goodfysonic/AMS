import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

const FloorForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
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
        rules={[{ required: true, message: 'Please input floor type!' }]}
      >
        <Input placeholder="Enter floor type" />
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
