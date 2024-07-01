const boxes = Array.from(document.getElementsByClassName("box"));
const p1Score = document.getElementById("p1");
const p2Score = document.getElementById("p2");
const turnText = document.getElementById("turn-text");

const winBox = document.getElementById("win");
const winnerName = document.getElementById("winnerName");
const winnerCharacter = document.getElementById("winnerCharacter");

let currentPlayer = "X";
let p1Points = parseInt(localStorage.getItem("p1Points")) || 0;
let p2Points = parseInt(localStorage.getItem("p2Points")) || 0;
let gameActive = true;

const saveScoresToLocalStorage = () => {
  localStorage.setItem("p1Points", p1Points);
  localStorage.setItem("p2Points", p2Points);
};

const printScores = () => {
  p1Score.textContent = `X : ${p1Points}`;
  p2Score.textContent = `O : ${p2Points}`;
};

const checkResult = () => {
  let roundWon = false;
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    const boxA = boxes[a].textContent;
    const boxB = boxes[b].textContent;
    const boxC = boxes[c].textContent;
    if (boxA === "" || boxB === "" || boxC === "") {
      continue;
    }
    if (boxA === boxB && boxB === boxC) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    gameActive = false;
    boxes.forEach((box) => box.removeEventListener("click", handleBoxClick));
    if (currentPlayer === "X") {
      p1Points++;
      winBox.style.display = "block";
      winnerCharacter.innerHTML = "X"
      winnerName.innerHTML = "p1"
    } else {
      p2Points++;
      winBox.style.display = "block";
      winnerCharacter.innerHTML = "O"
      winnerName.innerHTML = "p2"
    }
    saveScoresToLocalStorage();
    printScores();
    setTimeout(() => {
      resetBoard();
      location.reload(); // Reload the game
    }, 3000);
    return;
  }
  if (!boxes.some((box) => box.textContent === "")) {
    gameActive = false;
    saveScoresToLocalStorage();
    setTimeout(() => {
      resetBoard();
      location.reload(); // Reload the game
    }, 1000);
    return;
  }
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const handleBoxClick = (e) => {
  const clickedBox = e.target;
  const clickedBoxIndex = boxes.indexOf(clickedBox);
  if (boxes[clickedBoxIndex].textContent !== "" || !gameActive) {
    return;
  }
  boxes[clickedBoxIndex].textContent = currentPlayer;
  boxes[clickedBoxIndex].classList.add(currentPlayer);
  console.log(currentPlayer);
  checkResult();
  togglePlayer();
};

const resetBoard = () => {
  currentPlayer = "X";
  boxes.forEach((box) => {
    box.textContent = "";
    box.classList.remove("X", "O");
    box.addEventListener("click", handleBoxClick);
  });
};

const togglePlayer = () => {
  switch (currentPlayer) {
    case "X":
      currentPlayer = "O";
      break;
    case "O":
      currentPlayer = "X";
      break;

    default:
      break;
  }
  turnText.textContent = `Current Turn: ${currentPlayer}`;
};

printScores();
togglePlayer();
boxes.forEach((box) => box.addEventListener("click", handleBoxClick));