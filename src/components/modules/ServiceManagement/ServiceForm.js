import React from 'react';
import { Form, Input, InputNumber, Switch, Button } from 'antd';

const ServiceForm = ({ initialValues, onFinish, loading, form }) => {
  return (
    <Form
      form={form} // Sử dụng form instance từ props
      layout="vertical"
      initialValues={initialValues} // Gán initialValues vào form
      onFinish={onFinish}
      className="max-w-2xl"
    >
      {/* Bỏ trường Service ID */}
      {/* <Form.Item
        label="Service ID"
        name="service_id"
        rules={[
          { required: true, message: 'Please input service ID!' },
          { type: 'string', message: 'Service ID must be a string!' }
        ]}
      >
        <Input placeholder="Enter service ID" />
      </Form.Item> */}

      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Please input service name!' },
          { type: 'string', message: 'Name must be a string!' }
        ]}
      >
        <Input placeholder="Enter service name" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[
          { required: true, message: 'Please input price!' },
          { type: 'number', message: 'Price must be a number!' }
        ]}
      >
        <InputNumber
          className="w-full"
          min={0}
          step={0.01}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Enter price"
        />
      </Form.Item>

      <Form.Item
        label="Unit"
        name="unit"
        rules={[
          { required: true, message: 'Please input unit!' },
          { type: 'string', message: 'Unit must be a string!' }
        ]}
      >
        <Input placeholder="Enter unit (e.g., hour, piece, etc.)" />
      </Form.Item>

      <Form.Item
        label="Metered Service"
        name="meteredService"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item 
        name="is_metered_service"
        valuePropName="checked"
        hidden
      >
        <Switch />
      </Form.Item>

      <Form.Item className="mt-6">
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues?.service_id ? 'Update Service' : 'Create Service'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ServiceForm;
