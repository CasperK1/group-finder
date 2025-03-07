export function GroupLocation({ year = 'Unknown Year', city = 'Unknown City', time = 'Unknown Time' }) {
  return (
    <div className=" w-full p-4">
      <p className="text-gray-400">Location</p>
      <div className="flex justify-between text-gray-500 mt-2">
        <span>{year}</span>
        <span>{city}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
