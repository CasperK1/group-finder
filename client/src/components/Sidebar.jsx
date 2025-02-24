import React, { useState } from "react";

const Sidebar = () => {
  const [showStudyType, setShowStudyType] = useState(true);
  const [showYearStudy, setShowYearStudy] = useState(true);

  return (
    <aside className="sidebar p-4 bg-base-200 rounded-lg shadow-md w-64">
      <div className="mb-4">
        <h3
          onClick={() => setShowStudyType(!showStudyType)}
          className="text-lg font-semibold cursor-pointer"
        >
          Type of Study {showStudyType ? "-" : "+"}
        </h3>
        {showStudyType && (
          <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full ">
            <label><input type="checkbox" /> Smart IoT Systems</label>
            <label><input type="checkbox" /> Software Engineering</label>
            <label><input type="checkbox" /> Health Tech</label>
            <label><input type="checkbox" /> Web Development</label>
            <label><input type="checkbox" /> Game Development</label>
          </div>
        )}
      </div>
      <div>
        <h3
          onClick={() => setShowYearStudy(!showYearStudy)}
          className="text-lg font-semibold cursor-pointer"
        >
          Year of Study {showYearStudy ? "-" : "+"}
        </h3>
        {showYearStudy && (
          <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
            <label><input type="checkbox" /> First Year</label>
            <label><input type="checkbox" /> Second Year</label>
            <label><input type="checkbox" /> Third Year</label>
            <label><input type="checkbox" /> Senior Level</label>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
