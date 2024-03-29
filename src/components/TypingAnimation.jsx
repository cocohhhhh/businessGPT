const TypingAnimation = () => {
    return (
        <div className="flex items-center space-x-2">
        <div className="w-1 h-1 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 animate-pulse"></div>
        <div className="w-1 h-1 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 animate-pulse delay-75"></div>
        <div className="w-1 h-1 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 animate-pulse delay-150"></div>
        </div>
);
};

export default TypingAnimation;