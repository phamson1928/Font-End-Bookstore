import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  // Sample notification data - replace with real data from your backend
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Đơn hàng #1234 đã được giao', time: '2 phút trước', read: false },
    { id: 2, message: 'Khuyến mãi mới: Giảm 20% tất cả sách', time: '1 giờ trước', read: true },
    { id: 3, message: 'Đơn hàng #1233 đang được vận chuyển', time: '3 giờ trước', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button 
          className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
        >
          <BellIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg 
                    ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-96 overflow-y-auto"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Thông báo</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Đánh dấu đã đọc tất cả
                </button>
              )}
            </div>
          </div>
          <div className="py-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <div 
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                        active ? 'bg-gray-50' : ''
                      } ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <p className={`${!notification.read ? 'font-semibold' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  )}
                </Menu.Item>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">Không có thông báo mới</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-2 text-center">
            <Link 
              to="/thong-bao" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 block py-2"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell;
