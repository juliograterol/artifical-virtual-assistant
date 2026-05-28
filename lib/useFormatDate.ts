export const useFormatDate = (
  value: any,
  format?: "date" | "day" | "month" | "year" | "time" | "full-date",
) => {
  let d: Date;
  if (!value) return "";
  // 🔥 Firestore Timestamp
  if (typeof value === "object" && value.toDate) {
    d = value.toDate();
  } else if (typeof value === "number") {
    d = new Date(value);
  } else if (typeof value === "string") {
    d = new Date(value);
  } else {
    return "";
  }

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  switch (format) {
    case "date":
      return `${mm}/${dd}/${yy}`;
    case "time":
      return `${hh}:${min}`;
    default:
      return `${mm}/${dd}/${yy} ${hh}:${min}`;
  }
};
