import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Về AMS</h3>
            <p className="text-sm">
              AMS là hệ thống quản lý căn hộ hiện đại, giúp tối ưu hóa quá trình quản lý và nâng cao trải nghiệm của cư dân.
            </p>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="text-sm">
              <li className="mb-2">Email: info@ams.com</li>
              <li className="mb-2">Điện thoại: (84) 123-456-789</li>
              <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:underline">Trang chủ</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Dịch vụ</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Tin tức</a></li>
              <li><a href="#" className="hover:underline">Liên hệ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AMS - Apartment Management System. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;