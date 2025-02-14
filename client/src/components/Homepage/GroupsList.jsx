import "../index.css";

const groupsData = [
  { id: 1, name: "Group 1", category: "Software Engineering", icon: "📘" },
  { id: 2, name: "Group 2", category: "Software Engineering", icon: "📘" },
  { id: 3, name: "Group 3", category: "Health Tech", icon: "🔤" },
  { id: 4, name: "Group 4", category: "Software Engineering", icon: "🎯" },
  { id: 5, name: "Group 5", category: "Software Engineering", icon: "🌐" },
  { id: 6, name: "Group 6", category: "Software Engineering", icon: "🏠" },
  { id: 7, name: "Group 7", category: "Health Tech", icon: "📒" },
  { id: 8, name: "Group 8", category: "Health Tech", icon: "➕" },
  { id: 9, name: "Group 9", category: "Software Engineering", icon: "📘" },
];

function GroupsList() {
  return (
    <div className="groups-container">
      {groupsData.map((group) => (
        <div key={group.id} className="card">
          <span className="icon" style={{ fontSize: "24px" }}>
            {group.icon}
          </span>
          <h2>{group.name}</h2>
          <p>Location</p>
          <p>Year | City | Time</p>
          <p>
            It is a long established fact that a reader will be distracted by
            readable content.
          </p>
          <span className="category">{group.category}</span>
          <p className="date">28 March 2021</p>
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
