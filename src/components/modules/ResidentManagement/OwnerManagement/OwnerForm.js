import React from 'react';
import { Form, Input, Button, Card, Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const OwnerForm = ({ initialValues, onFinish, loading, form }) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
    initialValues={initialValues}
    className="max-w-2xl mx-auto"
  >
    <Card title="Owner Information" className="mb-6 shadow-sm">
      <Form.Item
        label="First Name"
        name="first_name"
        rules={[{ required: true, message: 'Please input first name!' }]}
      >
        <Input placeholder="Enter first name" />
      </Form.Item>
      <Form.Item
        label="Middle Name"
        name="middle_name"
      >
        <Input placeholder="Enter middle name" />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="last_name"
        rules={[{ required: true, message: 'Please input last name!' }]}
      >
        <Input placeholder="Enter last name" />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[{ required: true, message: 'Please input phone number!' }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>
      <Form.Item
        label="ID Card Number"
        name="id_card_number"
        rules={[{ required: true, message: 'Please input ID card number!' }]}
      >
        <Input placeholder="Enter ID card number" />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select gender!' }]}
      >
        <Select placeholder="Select gender">
          <Option value="MALE">Male</Option>
          <Option value="FEMALE">Female</Option>
          <Option value="OTHER">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Date of Birth"
        name="birth_day"
        rules={[{ required: true, message: 'Please input birth day!' }]}
      >
        <DatePicker placeholder="Select birth day" className="w-full" />
      </Form.Item>
    </Card>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        {initialValues ? 'Update Owner' : 'Create Owner'}
      </Button>
    </Form.Item>
  </Form>
);

OwnerForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default OwnerForm;
