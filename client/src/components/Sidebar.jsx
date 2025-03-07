import React, { useState } from 'react';

const Sidebar = () => {
  const [showStudyType, setShowStudyType] = useState(true);
  const [showYearStudy, setShowYearStudy] = useState(true);

  const studyTypes = [
    'Smart IoT Systems',
    'Software Engineering',
    'Health Tech',
    'Web Development',
    'Game Development',
  ];

  const yearLevels = ['First Year', 'Second Year', 'Third Year', 'Senior Level'];

  return (
    <aside className="sidebar p-6 bg-base-200 rounded-xl shadow-lg w-72 h-fit sticky top-4" data-theme="light">
      <div className="mb-6">
        <h3
          onClick={() => setShowStudyType(!showStudyType)}
          className="text-xl font-bold text-base-content hover:text-primary transition-colors duration-200 cursor-pointer flex items-center justify-between"
        >
          <span>Type of Study</span>
          <span className="text-2xl">{showStudyType ? '−' : '+'}</span>
        </h3>
        {showStudyType && (
          <div className="mt-3 dropdown-content menu p-4 bg-base-100 rounded-lg shadow-md w-full space-y-3">
            {studyTypes.map((study, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-base-content hover:text-primary cursor-pointer"
              >
                <input type="checkbox" className="checkbox checkbox-error checkbox-sm" /> {study}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3
          onClick={() => setShowYearStudy(!showYearStudy)}
          className="text-xl font-bold text-base-content hover:text-primary transition-colors duration-200 cursor-pointer flex items-center justify-between"
        >
          <span>Year of Study</span>
          <span className="text-2xl">{showYearStudy ? '−' : '+'}</span>
        </h3>
        {showYearStudy && (
          <div className="mt-3 dropdown-content menu p-4 bg-base-100 rounded-lg shadow-md w-full space-y-3">
            {yearLevels.map((year, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-base-content hover:text-primary cursor-pointer"
              >
                <input type="checkbox" className="checkbox checkbox-error checkbox-sm" /> {year}
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;