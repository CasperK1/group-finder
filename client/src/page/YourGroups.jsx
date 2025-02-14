import React from "react";
import HeaderSection from "../components/YourGroup/HeaderSection";
import GroupsList from "../components/YourGroup/GroupsList";
const YourGroups = () => {
  return (
    <div className="your-groups-container">
      <HeaderSection />
      <GroupsList />
    </div>
  );
};

export default YourGroups;
