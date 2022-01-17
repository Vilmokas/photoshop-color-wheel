const c = document.getElementById("colorCanvas");
const currentColor = document.getElementById("currentColor");

const wheelRadius = 100;
const wheelWidth = 15;
const center = { x: c.width / 2, y: c.height / 2 };

const getX = (angle) => {
  return (
    wheelRadius + wheelWidth + wheelRadius * Math.cos((angle * Math.PI) / 180)
  );
};

const getY = (angle) => {
  return (
    wheelRadius + wheelWidth + wheelRadius * Math.sin((angle * Math.PI) / 180)
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
let rgba = [0, 0, 0];

function initColorPicker() {
  const path = c.getContext("2d");

  path.fillStyle = colorCurrent;
  path.fillRect(0, 0, 50, 25);

  path.lineWidth = wheelWidth;

  // Draw outer color wheel
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
  let ctx = c.getContext("2d");

  // Draw triangle white and black color
  ctx.beginPath();
  ctx.moveTo(getX(0) - 18, getY(0));
  ctx.lineTo(getX(120) + 9, getY(120) - 9);
  ctx.lineTo(getX(240) + 9, getY(240) + 9);
  let grdBlack = ctx.createLinearGradient(
    getX(120) + 9,
    getY(120) - 9,
    getX(240) + 9,
    getY(240) + 9
  );
  grdBlack.addColorStop(0, "rgba(0,0,0,1)");
  grdBlack.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = grdBlack;
  ctx.fill();

  // Draw triangle base color
  ctx.beginPath();
  ctx.moveTo(getX(0) - 18, getY(0));
  ctx.lineTo(getX(120) + 9, getY(120) - 9);
  ctx.lineTo(getX(240) + 9, getY(240) + 9);
  let grdBase = ctx.createLinearGradient(
    getX(0) - 18,
    getY(0),
    getX(0) - 140,
    getY(0)
  );
  grdBase.addColorStop(0, `rgba(${rgba[0]},${rgba[1]},${rgba[2]},1)`);
  grdBase.addColorStop(1, `rgba(${rgba[0]},${rgba[1]},${rgba[2]},0)`);
  ctx.fillStyle = grdBase;
  ctx.fill();

  c.onclick = function (e) {
    colorPos.x = (e.offsetX / c.clientWidth) * c.width;
    colorPos.y = (e.offsetY / c.clientHeight) * c.height;

    let imgData = path.getImageData(colorPos.x, colorPos.y, 1, 1);
    rgba = imgData.data;
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
