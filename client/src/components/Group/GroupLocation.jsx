function GroupLocation({
    year = 'Unknown Year',
    city = 'Unknown City',
    time = 'Unknown Time',
    location = 'Unknown Location', // corrected spelling from "localtion"
  }) {
    return (
      <div className="mb-8 items-center justify-between">
        <p className="text-gray-400 mb-2">{location}</p>
        <div className="flex justify-between text-gray-400">
          <span>{year}</span>
          <span>{city}</span>
          <span>{time}</span>
        </div>
      </div>
    );
  }