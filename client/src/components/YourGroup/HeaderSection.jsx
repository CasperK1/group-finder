import React from "react";
import { useLocation } from "react-router-dom";
import groupsData from "../../data/GroupsData";

const HeaderSection = () => {
  const location = useLocation();
  const isYourGroupsPage = location.pathname === "/your-groups";
  const groupsCount = isYourGroupsPage ? 9 : groupsData.length; 
  
  return (
    <div className="header-section">
      <h2>{isYourGroupsPage ? `Your Groups: ${groupsCount}` : `${groupsCount} Groups Found`}</h2>
      <input type="text" className="search-bar" placeholder="🔍 Search groups..." />
      <select className="sort-dropdown">
        <option>Sort by: Newest</option>
      </select>
    </div>
  );
};

export default HeaderSection;
