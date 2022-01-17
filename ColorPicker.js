const c = document.getElementById("colorCanvas");
const currentColor = document.getElementById("currentColor");

const wheelRadius = 100;
const wheelWidth = 15;
const center = { x: c.width / 2, y: c.height / 2 };

const getX = (angle) => {
  return (
    wheelRadius +
    wheelWidth / 2 +
    wheelRadius * Math.cos((angle * Math.PI) / 180)
  );
};

const getY = (angle) => {
  return (
    wheelRadius +
    wheelWidth / 2 +
    wheelRadius * Math.sin((angle * Math.PI) / 180)
  );
};

const sliceCount = 12;
const sliceColors = [
  "#FF0000", // red
  "#FF8000", // orange
  "#FFFF00", // yellow
  "#80FF00", // spring green
  "#00FF00", // green
  "#00FF80", // turquoise
  "#00FFFF", // cyan
  "#0080FF", // ocean
  "#0000FF", // blue
  "#8000FF", // violet
  "#FF00FF", // magenta
  "#FF0080", // raspberry
];

const sliceSize = 360 / sliceCount;
const angleSize = (Math.PI * 2) / sliceCount;

let colorPos = { x: 0, y: 0 };
let colorCurrent = "rgb(0, 0, 0)";

function initColorPicker() {
  const path = c.getContext("2d");

  path.fillStyle = colorCurrent;
  path.fillRect(0, 0, 50, 25);

  path.lineWidth = wheelWidth;

  for (let i = 0; i < sliceCount; i++) {
    let start = sliceSize * i;
    let end = start + sliceSize;
    let gradiant = path.createLinearGradient(
      getX(start),
      getY(start),
      getX(end),
      getY(end)
    );
    gradiant.addColorStop(0, sliceColors[i]);
    let colorEndIndex = i + 1 >= sliceColors.length ? 0 : i + 1;
    gradiant.addColorStop(1, sliceColors[colorEndIndex]);
    path.beginPath();
    let angleStart = angleSize * i;
    let angleEnd = angleStart + angleSize;
    path.arc(center.x, center.y, wheelRadius, angleStart, angleEnd);
    path.strokeStyle = gradiant;
    path.stroke();
  }

  c.onclick = function (e) {
    colorPos.x = (e.offsetX / c.clientWidth) * c.width;
    colorPos.y = (e.offsetY / c.clientHeight) * c.height;

    let imgData = path.getImageData(colorPos.x, colorPos.y, 1, 1);
    let rgba = imgData.data;
    let color = "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
    colorCurrent = color;
    console.log("%c" + color, "color:" + color);

    currentColor.value = rgbToHex(rgba[0], rgba[1], rgba[2]);
    currentColor.dispatchEvent(new Event("change"));
    let context = c.getContext("2d");
    context.clearRect(0, 0, c.width, c.height);

    initColorPicker();
    drawColorMarker();
  };
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  let hex = componentToHex(r) + componentToHex(g) + componentToHex(b);
  return hex.toUpperCase();
}

const drawColorMarker = () => {
  let ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(colorPos.x, colorPos.y, 7, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
};

initColorPicker();
