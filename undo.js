let undoStack = [];
let redoStack = [];

const saveState = () => {
  undoStack.push(canvas.toDataURL());
};

const undo = () => {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL());
    let restoreState = undoStack.pop();
    const image = new Image();
    image.src = restoreState;
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  }
};

const redo = () => {
  if (redoStack.length > 0) {
    undoStack.push(canvas.toDataURL());
    let restoreState = redoStack.pop();
    const image = new Image();
    image.src = restoreState;
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  }
};

document.getElementById("geri_al").addEventListener("click", undo);
document.getElementById("ileri_al").addEventListener("click", redo);

canvas.addEventListener("mousedown", () => {
  saveState();
});

// add photo

const photoInput = document.getElementById("photoInput");

photoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      const image = new Image();
      image.src = reader.result;

      image.addEventListener("load", function () {
        // Resmi canvas'a çizin
        ctx.drawImage(image, 200, 155, canvas.width / 2, canvas.height / 2);
      });
    });

    reader.readAsDataURL(file);
  }
});

// zoom

(function () {
  let scale = 1.0;
  const minScale = 0.2;
  const maxScale = 3.0;
  const scaleStep = 0.1;

  const zoomIn = () => {
    if (scale < maxScale) {
      scale += scaleStep;
      applyScale();
      displayZoomLevel();
    }
  };

  const zoomOut = () => {
    if (scale > minScale) {
      scale -= scaleStep;
      applyScale();
      displayZoomLevel();
    }
  };

  const applyScale = () => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.style.transform = `scale(${scale})`;
    }
  };

  const displayZoomLevel = () => {
    const zoomLevel = document.getElementById("zoomLevel");
    if (zoomLevel) {
      zoomLevel.textContent = `Zoom Level: ${Math.round(scale * 100)}%`;
    }
  };

  const initializeZoom = () => {
    const zoomInButton = document.getElementById("zoomInButton");
    const zoomOutButton = document.getElementById("zoomOutButton");

    if (zoomInButton && zoomOutButton) {
      zoomInButton.addEventListener("click", zoomIn);
      zoomOutButton.addEventListener("click", zoomOut);
    }
  };

  initializeZoom();
  displayZoomLevel();
})();
