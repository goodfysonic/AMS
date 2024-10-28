import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Drawer, Dropdown, Avatar, Space } from "antd";
import { 
  MenuOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Building } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const [mobileVisible, setMobileVisible] = useState(false);

  // Thêm hàm xử lý logout
  const handleLogout = async () => {
    try {
      // Thực hiện các bước logout
      // 1. Xóa token từ localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // hoặc sessionStorage nếu bạn dùng sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // 2. Clear các state liên quan đến user nếu có
      // Ví dụ: setUser(null) nếu bạn dùng global state
      // 3. Điều hướng về trang login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: 'About Us'
    },
    {
      key: 'services',
      icon: <CustomerServiceOutlined />,
      label: 'Services'
    },
    {
      key: 'contact',
      icon: <PhoneOutlined />,
      label: 'Contact'
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Help'
    }
  ];

  const profileItems = [
    {
      key: 'user-info',
      label: (
        <div className="px-4 py-3 border-b">
          <p className="font-semibold text-gray-800">John Doe</p>
          <p className="text-xs text-gray-500">Building Manager</p>
          <p className="text-xs text-gray-500">john.doe@ams.com</p>
        </div>
      ),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
      className: 'px-2'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
      className: 'px-2'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout, // Thay đổi ở đây
      className: 'text-red-500 px-2'
    }
  ];

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
    setMobileVisible(false);
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Building size={32} className="text-white" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">AMS</h1>
              <p className="text-xs text-gray-200">Building Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Menu
              mode="horizontal"
              items={menuItems}
              onClick={handleMenuClick}
              className="bg-transparent border-none text-white min-w-[500px]"
              style={{
                backgroundColor: 'transparent',
              }}
              theme="dark"
              overflowedIndicator={<MenuOutlined className="text-white" />}
            />
            
            {/* Profile Section */}
            <div className="flex items-center space-x-4 pl-4 border-l border-blue-400">
              {/* Notification Bell */}
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-white hover:text-gray-200 flex items-center justify-center"
              />
              
              {/* Profile Dropdown */}
              <Dropdown 
                menu={{ items: profileItems }} 
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="w-56"
              >
                <Space className="cursor-pointer hover:text-gray-200">
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="bg-blue-500 border-2 border-white"
                  />
                  <span className="text-sm hidden xl:inline">John Doe</span>
                </Space>
              </Dropdown>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Dropdown 
              menu={{ items: profileItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar 
                icon={<UserOutlined />} 
                className="bg-blue-500 border-2 border-white cursor-pointer"
              />
            </Dropdown>
            
            <Button
              type="text"
              className="text-white"
              icon={<MenuOutlined />}
              onClick={() => setMobileVisible(true)}
            />
          </div>

          {/* Mobile Drawer */}
          <Drawer
            title={
              <div className="flex items-center space-x-3">
                <Building size={24} />
                <span className="font-bold">AMS Menu</span>
              </div>
            }
            placement="right"
            onClose={() => setMobileVisible(false)}
            open={mobileVisible}
            bodyStyle={{ padding: 0 }}
            width={300}
          >
            <Menu
              mode="vertical"
              items={menuItems}
              onClick={handleMenuClick}
              style={{ border: 'none' }}
            />
          </Drawer>
        </div>
      </div>
    </header>
  );
}

export default Header;