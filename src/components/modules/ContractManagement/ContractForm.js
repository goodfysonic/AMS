import React from 'react';
import { Form, Input, DatePicker, Select, Button, Card } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const { Option } = Select;

const ContractForm = ({ initialValues, onFinish, loading = false, form }) => {
  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue('start_date');
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject('End date must be after start date');
    }
    return Promise.resolve();
  };

  const validatePhoneNumber = (_, value) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (value && !phoneRegex.test(value)) {
      return Promise.reject('Please enter a valid phone number (10-11 digits)');
    }
    return Promise.resolve();
  };

  const validateIdCard = (_, value) => {
    const idCardRegex = /^[0-9]{9,12}$/;
    if (value && !idCardRegex.test(value)) {
      return Promise.reject('Please enter a valid ID card number (9-12 digits)');
    }
    return Promise.resolve();
  };

  const validateAge = (_, value) => {
    if (value) {
      const age = dayjs().diff(value, 'year');
      if (age < 18) {
        return Promise.reject('Resident must be at least 18 years old');
      }
    }
    return Promise.resolve();
  };

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
        initialValues={initialValues}
      >
        <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-xl font-semibold">Contract Registration Form</h2>
        </div>

        <Card title="Contract Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: 'Please select start date!' },
                { 
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs(), 'day')) {
                      return Promise.reject('Start date cannot be in the past');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
            >
              <DatePicker 
                className="w-full" 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select start date and time"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: 'Please select end date!' },
                { validator: validateEndDate }
              ]}
              getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
            >
              <DatePicker 
                className="w-full" 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select end date and time"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status!' }]}
              initialValue="ACTIVE"
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="TERMINATED">Terminated</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Apartment ID"
              name="apartment_id"
              rules={[
                { required: true, message: 'Please input apartment ID!' },
                { pattern: /^[A-Z0-9-]+$/, message: 'Apartment ID can only contain uppercase letters, numbers and hyphens' },
                { min: 3, message: 'Apartment ID must be at least 3 characters' },
                { max: 10, message: 'Apartment ID cannot exceed 10 characters' }
              ]}
            >
              <Input placeholder="Enter apartment ID" />
            </Form.Item>
          </div>
        </Card>

        <Card title="Resident Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="First Name"
              name={['resident', 'first_name']}
              rules={[
                { required: true, message: 'Please input first name!' },
                { pattern: /^[a-zA-Z\s]+$/, message: 'First name can only contain letters' },
                { min: 2, message: 'First name must be at least 2 characters' },
                { max: 50, message: 'First name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label="Middle Name"
              name={['resident', 'middle_name']}
              rules={[
                { required: true, message: 'Please input middle name!' },
                { pattern: /^[a-zA-Z\s]+$/, message: 'Middle name can only contain letters' },
                { max: 50, message: 'Middle name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Enter middle name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name={['resident', 'last_name']}
              rules={[
                { required: true, message: 'Please input last name!' },
                { pattern: /^[a-zA-Z\s]+$/, message: 'Last name can only contain letters' },
                { min: 2, message: 'Last name must be at least 2 characters' },
                { max: 50, message: 'Last name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Birth Day"
              name={['resident', 'birth_day']}
              rules={[
                { required: true, message: 'Please select birth day!' },
                { validator: validateAge }
              ]}
              getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
            >
              <DatePicker 
                className="w-full" 
                format="YYYY-MM-DD"
                placeholder="Select birth day"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name={['resident', 'gender']}
              rules={[{ required: true, message: 'Please select gender!' }]}
              initialValue="MALE"
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Email"
              name={['resident', 'email']}
              rules={[
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' },
                { max: 100, message: 'Email cannot exceed 100 characters' }
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name={['resident', 'phone_number']}
              rules={[
                { required: true, message: 'Please input phone number!' },
                { validator: validatePhoneNumber }
              ]}
            >
              <Input placeholder="Enter phone number" maxLength={11} />
            </Form.Item>
          </div>

          <Form.Item
            label="Career"
            name={['resident', 'career']}
            rules={[
              { required: true, message: 'Please input career!' },
              { min: 2, message: 'Career must be at least 2 characters' },
              { max: 100, message: 'Career cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder="Enter career" />
          </Form.Item>

          <Form.Item
            label="ID Card Number"
            name={['resident', 'id_card_number']}
            rules={[
              { required: true, message: 'Please input ID card number!' },
              { validator: validateIdCard }
            ]}
          >
            <Input placeholder="Enter ID card number" maxLength={12} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Form.Item
              label="City"
              name={['resident', 'city']}
              rules={[
                { required: true, message: 'Please input city!' },
                { min: 2, message: 'City must be at least 2 characters' },
                { max: 100, message: 'City cannot exceed 100 characters' }
              ]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              label="District"
              name={['resident', 'district']}
              rules={[
                { required: true, message: 'Please input district!' },
                { min: 2, message: 'District must be at least 2 characters' },
                { max: 100, message: 'District cannot exceed 100 characters' }
              ]}
            >
              <Input placeholder="Enter district" />
            </Form.Item>

            <Form.Item
              label="Ward"
              name={['resident', 'ward']}
              rules={[
                { required: true, message: 'Please input ward!' },
                { min: 2, message: 'Ward must be at least 2 characters' },
                { max: 100, message: 'Ward cannot exceed 100 characters' }
              ]}
            >
              <Input placeholder="Enter ward" />
            </Form.Item>

            <Form.Item
              label="Street"
              name={['resident', 'street']}
              rules={[
                { required: true, message: 'Please input street!' },
                { min: 2, message: 'Street must be at least 2 characters' },
                { max: 200, message: 'Street cannot exceed 200 characters' }
              ]}
            >
              <Input placeholder="Enter street" />
            </Form.Item>
          </div>
        </Card>

        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-6">
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

ContractForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default ContractForm;