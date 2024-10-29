import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, DatePicker, Checkbox, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const ApartmentForm = ({ 
  onSubmit, 
  initialValues = {}, 
  loading = false, 
  isEdit = false,
  onCancel
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState(initialValues?.status || 'AVAILABLE');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        sale_info: {
          ...initialValues.sale_info,
          sale_date: initialValues.sale_info?.sale_date ? moment(initialValues.sale_info.sale_date) : null,
        },
        furniture: initialValues.furniture || false,
        number_of_bedrooms: initialValues.number_of_bedrooms || 1,
        number_of_bathrooms: initialValues.number_of_bathrooms || 1,
        owner: initialValues.owner || null,
      });
      setStatus(initialValues.status || 'AVAILABLE');
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const transformedValues = {
      name: values.name,
      area: values.area,
      furniture: values.furniture || false,
      number_of_bedrooms: values.number_of_bedrooms,
      number_of_bathrooms: values.number_of_bathrooms,
      sale_info: {
        purchase_price: values.sale_info?.purchase_price || null,
        sale_date: values.sale_info?.sale_date ? values.sale_info.sale_date.toISOString() : null,
      },
      status: values.status,
      owner: status === 'SOLD' ? values.owner : null,
    };

    onSubmit(transformedValues);
  };

  const handleCancel = () => {
    form.resetFields();
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    if (value === 'SOLD') {
      form.setFieldsValue({
        sale_info: { purchase_price: null, sale_date: null },
      });
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialValues}
          disabled={loading}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Apartment Name"
                name="name"
                rules={[{ required: true, message: 'Please enter apartment name' }]}
              >
                <Input placeholder="Enter apartment name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Area (sqm)"
                name="area"
                rules={[{ required: true, message: 'Please enter area' }]}
              >
                <Input type="number" placeholder="Enter area in sqm" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Number of Bedrooms"
                name="number_of_bedrooms"
                rules={[{ required: true, message: 'Please enter number of bedrooms' }]}
              >
                <Input type="number" min={0} placeholder="Enter number of bedrooms" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Number of Bathrooms"
                name="number_of_bathrooms"
                rules={[{ required: true, message: 'Please enter number of bathrooms' }]}
              >
                <Input type="number" min={0} placeholder="Enter number of bathrooms" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Furniture"
                name="furniture"
                valuePropName="checked"
              >
                <Checkbox>Has Furniture</Checkbox>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Apartment Status"
                name="status"
                rules={[{ required: true, message: 'Please select apartment status' }]}
              >
                <Select 
                  placeholder="Select status"
                  onChange={handleStatusChange}
                  value={status}
                >
                  <Option value="AVAILABLE">Available</Option>
                  <Option value="SOLD">Sold</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Sale Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sale Price (VND)"
                name={['sale_info', 'purchase_price']}
                rules={[{ required: true, message: 'Please enter sale price' }]}
              >
                <Input 
                  type="number" 
                  placeholder="Enter sale price"
                  disabled={status === 'SOLD'} 
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Sale Date"
                name={['sale_info', 'sale_date']}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Select sale date"
                  disabled={status === 'SOLD'}
                />
              </Form.Item>
            </Col>
          </Row>

          {status === 'SOLD' && (
            <>
              <Divider>Owner Information</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="First Name"
                    name={['owner', 'first_name']}
                    rules={[{ required: true, message: 'Please enter first name' }]}
                  >
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Middle Name"
                    name={['owner', 'middle_name']}
                  >
                    <Input placeholder="Enter middle name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Last Name"
                    name={['owner', 'last_name']}
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name={['owner', 'phone_number']}
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name={['owner', 'email']}
                    rules={[
                      { type: 'email', message: 'Please enter valid email' }
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Address"
                    required
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={['owner', 'street']}
                        rules={[{ required: true, message: 'Please enter street' }]}
                        style={{ width: '30%' }}
                      >
                        <Input placeholder="Street" />
                      </Form.Item>
                      <Form.Item
                        name={['owner', 'ward']}
                        rules={[{ required: true, message: 'Please enter ward' }]}
                        style={{ width: '20%' }}
                      >
                        <Input placeholder="Ward" />
                      </Form.Item>
                      <Form.Item
                        name={['owner', 'district']}
                        rules={[{ required: true, message: 'Please enter district' }]}
                        style={{ width: '25%' }}
                      >
                        <Input placeholder="District" />
                      </Form.Item>
                      <Form.Item
                        name={['owner', 'city']}
                        rules={[{ required: true, message: 'Please enter city' }]}
                        style={{ width: '25%' }}
                      >
                        <Input placeholder="City" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Update Apartment' : 'Add Apartment'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ApartmentForm;