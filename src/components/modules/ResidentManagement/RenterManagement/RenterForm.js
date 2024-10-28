import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Card } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const { Option } = Select;

const RenterForm = ({ initialValues, onFinish, loading = false, form }) => {
  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        birth_day: initialValues.birth_day ? dayjs(initialValues.birth_day) : null,
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, form]);

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
      >
        <Card title="Renter Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: 'Please input first name!' }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: 'Please input last name!' }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item label="Middle Name" name="middle_name">
              <Input placeholder="Enter middle name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }, { type: 'email', message: 'Invalid email format' }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: 'Please input phone number!' }]}>
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item label="ID Card Number" name="id_card_number" rules={[{ required: true, message: 'Please input ID card number!' }]}>
              <Input placeholder="Enter ID card number" />
            </Form.Item>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender!' }]}>
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Birth Day" name="birth_day" rules={[{ required: true, message: 'Please select birth day!' }]}>
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>
        </Card>
        <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {initialValues ? 'Update Renter' : 'Create Renter'}
        </Button>
      </Form>
    </div>
  );
};

RenterForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default RenterForm;
