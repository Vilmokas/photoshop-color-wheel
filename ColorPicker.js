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

let mainColorPos = { x: getX(0), y: getY(0) };
let secondColorPos = { x: center.x, y: center.y };
let rgba = [0, 0, 0];
let mainColor = [0, 0, 0];

const path = c.getContext("2d");

const drawColorWheel = () => {
  let context = c.getContext("2d");
  context.clearRect(0, 0, c.width, c.height);

  path.lineWidth = wheelWidth + 4;

  // Draw corcle border
  path.beginPath();
  path.arc(center.x, center.y, wheelRadius, 0, 2 * Math.PI);
  path.strokeStyle = "#454545";
  path.stroke();

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

  // Draw triangle border
  ctx.beginPath();
  ctx.moveTo(getX(0) - 14, getY(0));
  ctx.lineTo(getX(120) + 7, getY(120) - 7);
  ctx.lineTo(getX(240) + 7, getY(240) + 7);
  ctx.fillStyle = "#454545";
  ctx.fill();

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
  grdBase.addColorStop(
    0,
    `rgba(${mainColor[0]},${mainColor[1]},${mainColor[2]},1)`
  );
  grdBase.addColorStop(
    1,
    `rgba(${mainColor[0]},${mainColor[1]},${mainColor[2]},0)`
  );
  ctx.fillStyle = grdBase;
  ctx.fill();
};

function initColorPicker() {
  drawColorWheel();

  c.onclick = function (e) {
    drawColorWheel();
    let colorPos = { x: 0, y: 0 };
    colorPos.x = (e.offsetX / c.clientWidth) * c.width;
    colorPos.y = (e.offsetY / c.clientHeight) * c.height;

    // Change the main color (outer ring)
    if (isInsideRing(colorPos.x, colorPos.y, wheelRadius, wheelWidth)) {
      mainColorPos.x = colorPos.x;
      mainColorPos.y = colorPos.y;
      let imgData = path.getImageData(
        mainColorPos.x,
        mainColorPos.y,
        1,
        1
      ).data;
      mainColor = [imgData[0], imgData[1], imgData[2]];
    }

    // Change the 2nd color (triangle)
    if (
      isInsideTriangle(
        colorPos,
        { x: getX(0) - 18, y: getY(0) },
        { x: getX(120) + 9, y: getY(120) - 9 },
        { x: getX(240) + 9, y: getY(240) + 9 }
      )
    ) {
      secondColorPos.x = colorPos.x;
      secondColorPos.y = colorPos.y;
    }

    drawColorWheel();

    console.log(`x: ${secondColorPos.x}, y: ${secondColorPos.y}`);
    let imgData = path.getImageData(secondColorPos.x, secondColorPos.y, 1, 1);
    rgba = imgData.data;

    console.log(rgbToHex(rgba[0], rgba[1], rgba[2]));
    currentColor.value = rgbToHex(rgba[0], rgba[1], rgba[2]);
    currentColor.dispatchEvent(new Event("change"));

    // Draw markers at the end to avoid detecting their color when picking colors
    drawColorMarker();
  };
}

const isInsideRing = (x, y, r, w) => {
  return (
    (x - center.x) * (x - center.x) + (y - center.y) * (y - center.y) >
      (r - w / 2) * (r - w / 2) &&
    (x - center.x) * (x - center.x) + (y - center.y) * (y - center.y) <
      (r + w / 2) * (r + w / 2)
  );
};

const isInsideTriangle = (p, p0, p1, p2) => {
  var A =
    (1 / 2) *
    (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
  var sign = A < 0 ? -1 : 1;
  var s =
    (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) *
    sign;
  var t =
    (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) *
    sign;

  return s > 0 && t > 0 && s + t < 2 * A * sign;
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  let hex = componentToHex(r) + componentToHex(g) + componentToHex(b);
  return hex.toUpperCase();
}

const drawColorMarker = () => {
  // Draw circle marker
  let ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(mainColorPos.x, mainColorPos.y, 7, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  //Draw triangle marker
  ctx.beginPath();
  ctx.arc(secondColorPos.x, secondColorPos.y, 7, 0, 2 * Math.PI);
  ctx.stroke();
};

initColorPicker();
