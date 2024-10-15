import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const BlockForm = ({ onSubmit, initialValues = {} }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
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
              rules={[{ required: true, message: 'Please enter block name' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Number of Floors"
              name="total_floor"
              rules={[{ required: true, message: 'Please enter number of floors' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Number of Apartments"
              name="total_apartment"
              rules={[{ required: true, message: 'Please enter number of apartments' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-center">
          <Button type="default" danger className="mr-4" onClick={() => form.resetFields()}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlockForm;
