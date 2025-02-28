import { useState } from 'react';
import { Icon } from '@iconify/react';
const Button = ({ onClick, text, className = '', icon }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick();
  };

  return (
    <button
      className={`${className} btn border-none shadow-none rounded-xl flex items-center gap-2 p-2`}
      onClick={handleClick}
    >
      {icon && <Icon icon={icon} className="text-lg" />}
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
        <Button
          onClick={handleBlockGroup}
          icon="fa-solid:ban"
          className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg text-white z-1000"
        />
        <Button
          onClick={handleSaveGroup}
          icon="fa-solid:bookmark"
          className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg text-white "
        />
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
