const COLORS = [
  "#27ae60",
  "#DAF7A6",
  "#FFC300",
  "#FF5733",
  "#C70039",
  "#900C3F",
  "#da658a",
  "#e9bcbf",
  "#ffa245",
  "#217e91",
  "#73ad8d"
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getColor = (index) =>
  COLORS[index] ? COLORS[index] : getRandomColor();
