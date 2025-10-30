import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full mb-6">
            <ApperIcon name="SearchX" size={48} className="text-blue-600" />
          </div>
          
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            404
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center space-x-4 text-sm">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/rooms"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Rooms
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/guests"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Guests
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ApperIcon name="Info" size={24} className="text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                If you believe this is an error, please contact support or check the URL you entered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;