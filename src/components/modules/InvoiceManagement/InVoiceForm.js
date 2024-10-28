import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Card, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const InvoiceForm = ({ 
  onFinish, 
  initialValues = null, 
  loading = false,
  apartments = [],
  services = []
}) => {
  const [form] = Form.useForm();

  const calculateTotal = (serviceDetails = []) => {
    if (!Array.isArray(serviceDetails)) return 0;
    
    return serviceDetails.reduce((total, detail) => {
      if (!detail || typeof detail.old_value !== 'number' || typeof detail.new_value !== 'number') {
        return total;
      }

      const service = services.find(s => s.service_id === detail.service_id);
      if (!service) return total;

      const amountOfUsing = detail.new_value - detail.old_value;
      return total + (amountOfUsing * service.price);
    }, 0);
  };

  const handleServiceDetailsChange = () => {
    try {
      const serviceDetails = form.getFieldValue('service_details');
      const total = calculateTotal(serviceDetails);
      form.setFieldValue('total', total);
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  useEffect(() => {
    if (initialValues?.service_details) {
      handleServiceDetailsChange();
    }
  }, [initialValues]);

  const normalizeInitialValues = (values) => {
    if (!values) return {
      service_details: [],
      total: 0,
      status: 'PENDING'
    };
    
    return {
      apartment_id: values.apartment?.apartment_id,
      payment_deadline: values.payment_deadline ? dayjs(values.payment_deadline) : undefined,
      status: values.status || 'PENDING',
      total: values.total || 0,
      service_details: values.service_details || []
    };
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={normalizeInitialValues(initialValues)}
      onValuesChange={(_, allValues) => {
        if (allValues.service_details) {
          handleServiceDetailsChange();
        }
      }}
      className="max-w-4xl mx-auto"
    >
      <Card className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            name="apartment_id"
            label="Apartment"
            rules={[{ required: true, message: 'Please select an apartment' }]}
          >
            <Select
              showSearch
              placeholder="Select apartment"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {apartments.map(apt => (
                <Option key={apt.apartment_id} value={apt.apartment_id}>
                  {apt.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="payment_deadline"
            label="Payment Deadline"
            rules={[{ required: true, message: 'Please select payment deadline' }]}
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="PENDING">Pending</Option>
              <Option value="PAID">Paid</Option>
              <Option value="OVERDUE">Overdue</Option>
            </Select>
          </Form.Item>

          <Form.Item name="total" label="Total Amount">
            <InputNumber
              className="w-full"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              disabled
            />
          </Form.Item>
        </div>
      </Card>

      <Card title="Service Details" className="mb-6 shadow-sm">
        <Form.List name="service_details">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="mb-4">
                  <div className="grid grid-cols-4 gap-4 items-start">
                    <Form.Item
                      {...restField}
                      name={[name, 'service_id']}
                      rules={[{ required: true, message: 'Select service' }]}
                      className="mb-2"
                    >
                      <Select placeholder="Select service">
                        {services.map(service => (
                          <Option key={service.service_id} value={service.service_id}>
                            {service.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'old_value']}
                      rules={[{ required: true, message: 'Enter old value' }]}
                      className="mb-2"
                    >
                      <InputNumber 
                        placeholder="Old value" 
                        className="w-full"
                        min={0}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'new_value']}
                      rules={[{ required: true, message: 'Enter new value' }]}
                      className="mb-2"
                    >
                      <InputNumber 
                        placeholder="New value" 
                        className="w-full"
                        min={0}
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      className="text-red-500 mt-2"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Divider className="my-4" />
                </div>
              ))}

              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Service
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <div className="flex justify-end gap-4">
        <Button size="large" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="primary" size="large" htmlType="submit" loading={loading}>
          Save Invoice
        </Button>
      </div>
    </Form>
  );
};

export default InvoiceForm;