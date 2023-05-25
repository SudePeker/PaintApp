let canvas = document.querySelector("canvas");
let tool = document.querySelectorAll(".tool");
let color_option = document.querySelectorAll(".option");
let color_picker = document.querySelector("#color_picker");
let slider = document.querySelector("#slider");
let startFunction = document.querySelectorAll(".startFunction");
let colorCheck = document.querySelector("#colorCheck");
let ctx = canvas.getContext("2d");
let pageX, pageY;
let brush_Width = 5;
let select_tool = "brush";
let selected_Color = "#000";
let isDrawing = false;
let snapshot;

const setCanvasBackground = () => {
  // setting whole canvas background to white, so the downloaded img background will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selected_Color; // setting fillstyle back to the selectedColor, it'll be the brush color
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  if (colorCheck.checked) {
    return ctx.fillRect(
      e.offsetX,
      e.offsetY,
      pageX - e.offsetX,
      pageY - e.offsetY
    );
  }
  ctx.strokeRect(e.offsetX, e.offsetY, pageX - e.offsetX, pageY - e.offsetY);
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(pageX - e.offsetX, 2) + Math.pow(pageY - e.offsetY, 2)
  );
  ctx.arc(pageX, pageY, radius, 0, 2 * Math.PI);
  if (colorCheck.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(pageX, pageY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(pageX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  if (colorCheck.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

const drawStart = (e) => {
  isDrawing = true;
  pageX = e.offsetX;
  pageY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brush_Width;
  ctx.strokeStyle = selected_Color;
  ctx.fillStyle = selected_Color;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  if (select_tool === "brush" || select_tool === "eraser") {
    ctx.strokeStyle = select_tool === "eraser" ? "#fff" : selected_Color;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (select_tool === "rectangle") {
    drawRect(e);
  } else if (select_tool === "circle") {
    drawCircle(e);
  } else if (select_tool === "triangle") {
    drawTriangle(e);
  }
};

tool.forEach((element) => {
  element.addEventListener("click", () => {
    document
      .querySelector(".top_tools .active_tool")
      .classList.remove("active_tool");
    element.classList.add("active_tool");
    select_tool = element.id;
  });
});

color_option.forEach((element) => {
  element.addEventListener("click", () => {
    document
      .querySelector(".ul_color_list .selected_color")
      .classList.remove("selected_color");
    element.classList.add("selected_color");
    selected_Color = window
      .getComputedStyle(element)
      .getPropertyValue("background-color");
  });
});
color_picker.addEventListener("change", () => {
  color_picker.parentElement.style.background = color_picker.value;
  color_picker.parentElement.click();
});

slider.addEventListener("change", () => {
  brush_Width = slider.value;
});

for (const element of startFunction) {
  element.addEventListener("click", () => {
    if (element.id === "save") {
      let a = document.createElement("a");
      a.download = Math.random() * 2 + ".jpg";
      a.href = canvas.toDataURL();
      a.click();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasBackground();
    }
  });
}
canvas.addEventListener("mousedown", drawStart);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
