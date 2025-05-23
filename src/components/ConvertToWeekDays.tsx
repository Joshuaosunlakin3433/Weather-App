 export const toWeekDays = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    console.log(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    console.log(dayName);
    return dayName;
  };

  //function to convert date string to weekday
