import React from 'react';
import GroupsList from '../components/YourGroup/GroupsList';
const YourGroups = () => {
  return (
    <div className="your-groups-container">
      <GroupsList allGroup={false} ownGroup={true} />
    </div>
  );
};

export default YourGroups;
