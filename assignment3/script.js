document.addEventListener("DOMContentLoaded", function () {
  // Get references to image upload inputs, buttons, and other elements
  const imageInputs = [
    document.getElementById("image-upload1"),
    document.getElementById("image-upload2"),
    document.getElementById("image-upload3"),
  ];
  const createPuzzleBtn = document.getElementById("create-puzzle-btn");
  const uploadContainer = document.getElementById("upload-area");
  const puzzleContainer = document.getElementById("puzzle-container");
  const puzzleGrid = document.getElementById("puzzle-grid");
  const stageTitle = document.getElementById("stage-title");
  const successMsg = document.getElementById("success-msg");
  const nextStageBtn = document.getElementById("next-stage-btn");
  const restartBtn = document.getElementById("restart-btn");
  const pageStyle = document.getElementById("pagestyle");

  // Initialize variables for storing selected images, stage, and grid sizes
  let selectedImageSrcs = ["", "", ""];
  let currentStage = 1;
  const maxStage = 3;
  const gridSizes = [3, 4, 5];
  let puzzlePieces = [];
  let loadedImagesCount = 0;

  // Add event listeners to image upload inputs
  imageInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", handleImageUpload);
    }
  });

  // Add event listeners to buttons
  createPuzzleBtn.addEventListener("click", startPuzzle);
  nextStageBtn.addEventListener("click", nextStage);
  restartBtn.addEventListener("click", restartGame);

  // Handle image upload changes
  function handleImageUpload() {
    loadedImagesCount = 0;
    if (imageInputs.every((input) => input && input.files.length > 0)) {
      if (
        imageInputs.some((input) => !input.files[0].type.startsWith("image/"))
      ) {
        alert("Please upload valid image files only.");
        createPuzzleBtn.disabled = true;
        return;
      }
      createPuzzleBtn.disabled = false;
    }
  }

  // Start the puzzle game with uploaded images
  function startPuzzle() {
    loadedImagesCount = 0;
    selectedImageSrcs = ["", "", ""];
    for (let i = 0; i < imageInputs.length; i++) {
      if (imageInputs[i] && imageInputs[i].files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
          selectedImageSrcs[i] = e.target.result;
          loadedImagesCount++;
          if (loadedImagesCount === imageInputs.length) {
            uploadContainer.style.display = "none";
            puzzleContainer.style.display = "flex";
            loadPuzzleStage();
          }
        };
        reader.readAsDataURL(imageInputs[i].files[0]);
      }
    }

    if (currentStage === 1) {
      pageStyle.setAttribute("href", "stage1.css");
      console.log("Stage 1 시작");
    }
  }

  // Load the current stage of the puzzle
  function loadPuzzleStage() {
    const gridSize = gridSizes[currentStage - 1];
    stageTitle.textContent = `Stage ${currentStage}`;
    puzzleGrid.innerHTML = "";

    // Set puzzle grid size based on window width
    const puzzleSize = Math.min(400, window.innerWidth * 0.9);
    puzzleGrid.style.width = `${puzzleSize}px`;
    puzzleGrid.style.height = `${puzzleSize}px`;
    puzzleGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    puzzleGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    // Load the image and create puzzle pieces
    const img = new Image();
    img.src = selectedImageSrcs[currentStage - 1];
    img.onload = function () {
      if (img.width === 0 || img.height === 0) {
        alert("Image could not be loaded correctly. Please try again.");
        return;
      }

      const pieceWidth = puzzleSize / gridSize;
      const pieceHeight = puzzleSize / gridSize;
      puzzlePieces = [];

      // Create puzzle pieces and add them to the grid
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const piece = document.createElement("div");
          piece.classList.add("puzzle-piece");
          piece.style.width = `${pieceWidth}px`;
          piece.style.height = `${pieceHeight}px`;
          piece.style.backgroundImage = `url(${
            selectedImageSrcs[currentStage - 1]
          })`;
          piece.style.backgroundPosition = `${-col * pieceWidth}px ${
            -row * pieceHeight
          }px`;
          piece.style.backgroundSize = `${puzzleSize}px ${puzzleSize}px`;
          piece.style.boxSizing = "border-box";
          piece.style.border = "none";
          piece.style.margin = "0";
          piece.style.padding = "0";

          const index = row * gridSize + col;
          piece.dataset.index = index;

          addDragDropEvents(piece); // Add drag and drop events to each piece

          puzzleGrid.appendChild(piece);
          puzzlePieces.push(piece);
        }
      }

      // Shuffle the puzzle pieces and add them to the grid
      shuffle(puzzlePieces);
      puzzlePieces.forEach((piece) => {
        puzzleGrid.appendChild(piece);
      });

      successMsg.classList.add("hidden");
      successMsg.style.display = "none";
      nextStageBtn.style.display = "none";
      restartBtn.style.display = "none";
    };
    img.onerror = function () {
      alert(
        "Image could not be loaded. Please try again with a different file."
      );
    };
  }

  // Shuffle the puzzle pieces using the Fisher-Yates algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Add drag and drop event listeners to puzzle pieces
  function addDragDropEvents(piece) {
    piece.draggable = true;
    piece.addEventListener("dragstart", handleDragStart);
    piece.addEventListener("dragover", handleDragOver);
    piece.addEventListener("drop", handleDrop);
  }

  let draggedPiece = null;

  // Handle the start of a drag event
  function handleDragStart(event) {
    draggedPiece = event.target;
    event.dataTransfer.effectAllowed = "move";
  }

  // Handle the drag over event to allow dropping
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  // Handle the drop event and swap pieces
  function handleDrop(event) {
    event.preventDefault();
    const targetPiece = event.target;

    if (draggedPiece && targetPiece.classList.contains("puzzle-piece")) {
      const draggedIndex = Array.from(puzzleGrid.children).indexOf(
        draggedPiece
      );
      const targetIndex = Array.from(puzzleGrid.children).indexOf(targetPiece);

      // Swap the dragged piece with the target piece
      if (draggedIndex !== targetIndex) {
        const tempNode = document.createElement("div");
        puzzleGrid.replaceChild(tempNode, draggedPiece);
        puzzleGrid.replaceChild(draggedPiece, targetPiece);
        puzzleGrid.replaceChild(targetPiece, tempNode);
      }

      if (completePuzzle()) {
        showSuccessMessage();
      }
    }

    draggedPiece = null;
  }

  // Check if the puzzle is completed
  function completePuzzle() {
    return Array.from(puzzleGrid.children).every(
      (piece, index) => parseInt(piece.dataset.index) === index
    );
  }

  // Show the success message when the puzzle is solved
  function showSuccessMessage() {
    if (currentStage < maxStage) {
      successMsg.textContent = "Puzzle Solved!";
      successMsg.classList.remove("hidden");

      puzzleGrid.appendChild(successMsg);
      successMsg.style.position = "absolute";
      successMsg.style.top = "50%";
      successMsg.style.left = "50%";
      successMsg.style.transform = "translate(-50%, -50%)";
      successMsg.style.display = "block";

      nextStageBtn.style.display = "block";
    } else if (currentStage === maxStage) {
      setTimeout(function () {
        alert("All stages cleared!");
      }, 500);
      restartBtn.style.display = "block";
    }
  }

  // Move to the next stage of the puzzle
  function nextStage() {
    currentStage++;
    if (currentStage > maxStage) {
      restartGame();
    } else {
      loadPuzzleStage();
      successMsg.classList.add("hidden");
      nextStageBtn.classList.add("hidden");

      if (currentStage === 2) {
        pageStyle.setAttribute("href", "stage2.css");
        console.log("Stage 2 start");
      } else if (currentStage === 3) {
        pageStyle.setAttribute("href", "stage3.css");
        console.log("Stage 3 start");
      }
    }
  }

  // Restart the game by reloading the page
  function restartGame() {
    location.reload();
  }
});
