import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, DatePicker, Checkbox } from 'antd';
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
      });
      setStatus(initialValues.status || 'AVAILABLE');
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const transformedValues = {
      name: values.name,
      area: values.area,
      furniture: values.furniture || false,
      sale_info: {
        purchase_price: values.sale_info?.purchase_price || null,
        sale_date: values.sale_info?.sale_date ? values.sale_info.sale_date.toISOString() : null,
      },
      status: values.status,
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
                label="Furniture"
                name="furniture"
                valuePropName="checked"
              >
                <Checkbox>Has Furniture</Checkbox>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Sale Price"
                name={['sale_info', 'purchase_price']}
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
