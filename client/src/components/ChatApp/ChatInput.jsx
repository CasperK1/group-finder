const ChatInput = ({ onSendMessage, setMessage, message }) => {
  
    const handleChange = (event) => {
      setMessage(event.target.value);
    };
  
    const handleSend = () => {
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }
    };
      return (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost text-gray-500">
              <i className="fas fa-plus-circle"></i>
            </button>
            <input
              type="text"
              placeholder="Type a message"
              className="input input-bordered w-full"
              value={message}
              onChange={handleChange}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      );
}
export default ChatInput