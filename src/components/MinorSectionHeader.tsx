import Greeting from "./Greeting";
import TimeComponent from "./Time";

export const MinorSectionHeader = () => {
  return (
    <div className="flex flex-col items-center gap-5 lg:gap-10">
      <Greeting className="lg:text-4xl md:text-3xl text-xl text-black/75 text-center" />
      <TimeComponent className="text-xl md:text-3xl lg:text-4xl text-black/75 text-center" />
    </div>
  );
};

