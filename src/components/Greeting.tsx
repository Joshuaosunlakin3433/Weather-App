interface GreetingProps {
  className?: string;
}

// This component displays a greeting message based on the current time of day.
// It uses the Date object to get the current hour and returns a different greeting
const Greeting = ({className}:GreetingProps) => {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };
  return <div className={className}>{getCurrentGreeting()}!</div>;
};

export default Greeting;
