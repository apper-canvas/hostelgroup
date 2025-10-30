import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/layouts/Root';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm"
      onClick={handleLogout}
      className="flex items-center space-x-2"
    >
      <ApperIcon name="LogOut" size={14} />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;