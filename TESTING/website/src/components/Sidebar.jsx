import React, { useState } from "react";

const Sidebar = () => {
  const [showStudyType, setShowStudyType] = useState(false);
  const [showYearStudy, setShowYearStudy] = useState(false);

  return (
    <aside className="sidebar">
      {/* Type of Study Dropdown */}
      <div className="dropdown">
        <h3 onClick={() => setShowStudyType(!showStudyType)} className="dropdown-title">
          Type of Study {showStudyType ? "-" : "+"}
        </h3>
        {showStudyType && (
          <div className="dropdown-content">
            <label><input type="checkbox" /> Smart IoT Systems</label>
            <label><input type="checkbox" /> Software Engineering</label>
            <label><input type="checkbox" /> Health Tech</label>
            <label><input type="checkbox" /> Web Development</label>
            <label><input type="checkbox" /> Game Development</label>
          </div>
        )}
      </div>

      {/* Year of Study Dropdown */}
      <div className="dropdown">
        <h3 onClick={() => setShowYearStudy(!showYearStudy)} className="dropdown-title">
          Year of Study {showYearStudy ? "-" : "+"}
        </h3>
        {showYearStudy && (
          <div className="dropdown-content">
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
