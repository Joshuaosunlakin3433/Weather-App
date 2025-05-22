import { useState, useEffect } from "react";
interface TimeProps {
  className?: string;
}
const TimeComponent = ({className}:TimeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // This gives AM/PM format
    });
  };

  return (
    <div>
      <h2 className= {className}>{formatTime(currentTime)}</h2>
    </div>
  );
};

export default TimeComponent;
