export const formattedDate = (date: Date) => {
  return date
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace("am", "AM")
    .replace("pm", "PM");
};

export const capitalizeFirstLetter = (value: string): string => {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
};
