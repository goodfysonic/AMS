import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Form, Input, Button, Space, Spin, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const API_URL = 'http://localhost:8080/identity/api';

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/my/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      form.setFieldsValue({
        username: response.data.username,
        ...response.data.user_info
      });
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle profile update
  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        user_id: userData.user_id,
        username: userData.username,
        status: userData.status,
        role: userData.role, // Assuming this comes from userData
        user_info: {
          email: values.email,
          first: values.first,
          middle: values.middle,
          last: values.last,
          prefix: values.prefix,
          phone: values.phone,
          country: values.country
        }
      };

      await axios.put(`${API_URL}/users/${userData.user_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Profile updated successfully');
      await fetchUserData();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/my/account/change_password`, {
        user_id: userData.user_id, // This is necessary for your API
        old_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={userData}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                name="first"
                label="Tên"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="last"
                label="Họ"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="middle"
                label="Tên lót"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="prefix"
                label="Danh xưng"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
              >
                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                name="country"
                label="Quốc gia"
              >
                <Input prefix={<GlobalOutlined className="site-form-item-icon" />} />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Space>
        </Form>
      ),
    },
    {
      key: 'password',
      label: 'Đổi mật khẩu',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Space>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <UserOutlined /> Thông tin tài khoản
      </Title>

      <Spin spinning={loading && !userData}>
        <Card>
          <Tabs items={items} />
        </Card>
      </Spin>
    </div>
  );
};

export default Profile;
