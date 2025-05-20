import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardList, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? 'bg-blue-700 text-white' 
      : 'text-blue-100 hover:bg-blue-600';
  };

  return (
    <nav className="bg-blue-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart3 className="mr-2" size={24} />
            <h1 className="text-xl font-bold">生産進捗管理システム</h1>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md transition duration-200 flex items-center ${getActiveClass('/')}`}
            >
              <BarChart3 className="mr-2" size={18} />
              <span>ダッシュボード</span>
            </Link>
            
            <Link 
              to="/data-entry" 
              className={`px-4 py-2 rounded-md transition duration-200 flex items-center ${getActiveClass('/data-entry')}`}
            >
              <ClipboardList className="mr-2" size={18} />
              <span>データ入力</span>
            </Link>
            
            <Link 
              to="/settings" 
              className={`px-4 py-2 rounded-md transition duration-200 flex items-center ${getActiveClass('/settings')}`}
            >
              <Settings className="mr-2" size={18} />
              <span>設定</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;