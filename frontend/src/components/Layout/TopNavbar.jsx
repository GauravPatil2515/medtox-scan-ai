import React, { Fragment } from 'react';
import { Menu, Transition, Popover } from '@headlessui/react';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const TopNavbar = ({ setSidebarOpen, pageTitle = 'Dashboard' }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const userNavigation = [
    { name: 'Your Profile', href: '/app/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/app/settings', icon: CogIcon },
    { name: 'Sign out', href: '/', icon: ArrowRightOnRectangleIcon },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Model Training Complete',
      message: 'XGBoost model has finished training with 94% accuracy',
      time: '2 min ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Batch Processing',
      message: '250 molecules processed successfully',
      time: '5 min ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'New features available in prediction pipeline',
      time: '1 hour ago',
      type: 'update'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success-100 text-success-600';
      case 'info':
        return 'bg-primary-100 text-primary-600';
      case 'update':
        return 'bg-warning-100 text-warning-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-soft sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      {/* Page title */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
        
        {/* Search */}
        <form className="relative flex flex-1 max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
            placeholder="Search molecules, results, or models..."
            type="search"
            name="search"
          />
        </form>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Dark mode toggle */}
        <button
          type="button"
          className="relative rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => setDarkMode(!darkMode)}
        >
          <span className="sr-only">Toggle dark mode</span>
          {darkMode ? (
            <SunIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MoonIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* Notifications dropdown */}
        <Popover className="relative">
          <Popover.Button className="relative rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 hover:scale-110 transition-all duration-300 ease-in-out">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            {/* Notification badge */}
            <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-danger-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">{notifications.length}</span>
            </div>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white py-2 shadow-luxury ring-1 ring-gray-900/5">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out">
                    <div className="flex items-start space-x-3">
                      <div className={clsx(
                        'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                        getNotificationIcon(notification.type)
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  View all notifications
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-x-2 rounded-full bg-white p-1.5 text-sm leading-6 text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-xs font-medium text-white">GP</span>
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                Gaurav Patil
              </span>
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-white py-2 shadow-luxury ring-1 ring-gray-900/5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={clsx(
                        active ? 'bg-gray-50' : '',
                        'flex items-center px-3 py-2 text-sm leading-6 text-gray-900 mx-2 rounded-lg transition-colors duration-150'
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default TopNavbar;