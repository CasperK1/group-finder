export function GroupDescription({ description = 'No description available.' }) {
  return (
    <div className="w-full shadow-lg p-4 mb-6 ">
        <p className="text-gray-600 mb-8">{description}</p>
    </div>
  );
}
