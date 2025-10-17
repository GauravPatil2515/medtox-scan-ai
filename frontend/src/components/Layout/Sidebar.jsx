import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BeakerIcon, 
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Predictions', href: '/app/predictions', icon: BeakerIcon },
  { name: 'Batch Processing', href: '/app/batch', icon: DocumentDuplicateIcon },
  { name: 'Chat', href: '/app/chat', icon: ChatBubbleLeftRightIcon },
];



const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-primary-600 to-primary-800 px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BeakerIcon className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-success-400 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">MedToXAi</h1>
            <p className="text-xs text-primary-200">Molecular Predictions</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(
                      location.pathname === item.href
                        ? 'bg-white/10 text-white shadow-soft transform scale-105'
                        : 'text-primary-200 hover:text-white hover:bg-white/10 hover:scale-105 hover:shadow-md',
                      'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-300 ease-in-out cursor-pointer'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        location.pathname === item.href ? 'text-white' : 'text-primary-300 group-hover:text-white group-hover:scale-110',
                        'h-5 w-5 shrink-0 transition-all duration-300'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    {location.pathname === item.href && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>


        </ul>
      </nav>

      {/* User info */}
      <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">GP</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Gaurav Patil</p>
            <p className="text-xs text-primary-200">Researcher</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;