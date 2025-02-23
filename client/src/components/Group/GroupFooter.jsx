import { useState } from "react";
const Button = ({ onClick, text, className, icon }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick(); 
  };

  return (
    <button
      className={`${className} btn border-none shadow-none rounded-xl 
      `}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
export function GroupFooter({
  groupInfo,
  isJoinedGroup,
  date,
  handleJoinGroup,
  handleBlockGroup,
  handleSaveGroup,
  handleLeaveGroup,
}) {

  const renderJoinButton = () => (
    <div className="flex items-center justify-between mb-4 px-4">
      <span className="text-gray-400">{date}</span>
      {groupInfo && (
        <div className="flex-grow flex justify-center">
          <Button onClick={handleJoinGroup} text="Join" className="bg-black text-white px-4 py-2 rounded" />
        </div>
      )}

      <div className="flex space-x-4">
        <Button onClick={handleBlockGroup} className="fas fa-ban text-black" icon="fas fa-ban" />
        <Button onClick={handleSaveGroup} className="fas fa-bookmark text-black" icon="fas fa-bookmark" />
      </div>
    </div>
  );

  const renderLeaveButton = () => (
    <div className="flex items-center justify-between mb-4 px-4">
      <div className="flex-grow flex justify-center">
        <Button onClick={handleLeaveGroup} text="Leave" className="bg-black text-white px-4 py-2 rounded" />
      </div>
    </div>
  );

  return <div>{!isJoinedGroup ? renderJoinButton() : renderLeaveButton()}</div>;
}
