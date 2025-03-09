import React from 'react';
import HeaderSection from './components/HeaderSection';
import GroupsList from './components/GroupsList';

const YourGroups = () => {
  return (
    <div className="your-groups-container">
      <HeaderSection />
      <GroupsList />
    </div>
  );
};

export default YourGroups;
