import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="user-menu">
      <FaUser />
      <span>{username}</span>
      <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserMenu;
