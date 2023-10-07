let currentRow = 0;
let currentCol = 0;
let wordle;
let isGameOver = false;
let valid;
let canClick = true;
let rapidApiKey = "3301870637mshfbd54904ed18c01p1f4fe9jsn5ac9f3d0b162";

const createGameContainer = () => {
  document.getElementById("loading").remove();
  const bodyTag = document.body;
  bodyTag.classList.add("bg-orange-50");
  const numOfLetters = 5;
  const triedCount = 6;
  const gameContainer = document.createElement("div");
  gameContainer.setAttribute("id", "game-container");
  gameContainer.setAttribute(
    "class",
    "w-[500px] my-2 mx-auto  flex flex-col items-center justify-center"
  );
  bodyTag.append(gameContainer);
  setting(gameContainer);
  createTileDisplay(gameContainer, triedCount, numOfLetters);
  createKeyboard(gameContainer, numOfLetters, triedCount);
};

const setting = (parent) => {
  const setting = document.createElement("div");
  setting.setAttribute("class", "w-full relative flex items-center my-4");
  giveUpText(setting);
  howToPlayButton(setting);
  parent.append(setting);
};

const giveUpText = (parent) => {
  const div = document.createElement("div");
  div.textContent = "Give up";
  div.setAttribute(
    "class",
    "hidden px-4 py-2 bg-gray-200 text-left my-2 rounded-md inline-block hover:transition-color hover:text-red-500 hover:bg-red-200"
  );
  div.setAttribute("id", "give-up");
  div.addEventListener("click", () => giveUp());
  parent.append(div);
};

/**
 * If you don't want to try this word
 */
const giveUp = () => {
  isGameOver = true;
  gameFinished("You Lose😔");
};

const createTileDisplay = (parent, triedCount, numOfLetters) => {
  const tileContainer = document.createElement("div");
  tileContainer.setAttribute("id", "title-container");
  for (let i = 0; i < triedCount; i++) {
    const row = document.createElement("div");
    row.setAttribute("class", "flex");
    row.setAttribute("id", `row-${i}`);
    tileContainer.append(row);
    for (let j = 0; j < numOfLetters; j++) {
      const col = document.createElement("div");
      col.setAttribute(
        "class",
        "w-16 h-16 m-1 font-semibold text-xl border-2 border-gray-400 rounded-md flex justify-center items-center"
      );
      col.setAttribute("id", `row-${i}-col-${j}`);
      row.append(col);
    }
  }
  parent.append(tileContainer);
};

const createKeyboard = (parent, numOfLetters, triedCount) => {
  const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "<<",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "ENTER",
  ];
  const keyboard = document.createElement("div");
  keyboard.setAttribute("class", "flex flex-wrap w-[576px] my-2");
  keyboard.setAttribute("id", "keyboard-container");

  keys.forEach((key) => {
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute(
      "class",
      "px-4 py-2 font-semibold text-2xl m-1 bg-gray-200 rounded-md flex justify-center items-center hover:bg-gray-400 hover:text-white"
    );
    if (key == "A") buttonElement.classList.add("ml-8");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () =>
      handleClick(key, numOfLetters, triedCount)
    );
    keyboard.append(buttonElement);
  });
  parent.append(keyboard);
};

const addOneLetter = (letter, numOfLetters, triedCount) => {
  if (currentRow < triedCount && currentCol < numOfLetters) {
    const current = document.getElementById(
      `row-${currentRow}-col-${currentCol}`
    );
    current.textContent = letter;
    current.classList.remove("border-2", "border-gray-400");
    current.classList.add("bg-gray-500", "text-white", "animate-scale");
    currentCol++;
  }
};

const deleteOneLetter = () => {
  if (currentCol > 0) {
    currentCol--;
    const current = document.getElementById(
      `row-${currentRow}-col-${currentCol}`
    );
    current.innerText = "";
    current.classList.add("border-2", "border-gray-400");
    current.classList.remove("bg-gray-500", "text-white", "animate-scale");
  }
};

const addColorToTileAndKeyBoard = (data, tile, color) => {
  const key = document.getElementById(data);
  key.setAttribute(
    "class",
    `px-4 py-2 text-white font-semibold text-2xl m-1 bg-${color}-500 rounded-md flex justify-center items-center hover:bg-${color}-700`
  );
  if (data == "A") key.classList.add("ml-8");
  tile.classList.add(`bg-${color}-500`);
};

/**
 * Fliping tile in the current row
 * @param {*} rowValues
 */
const flipTile = (rowValues) => {
  rowValues.forEach((tile, index) => {
    const data = tile.innerText;
    setTimeout(() => {
      tile.classList.remove("animate-scale");
      if (data == wordle[index]) {
        addColorToTileAndKeyBoard(data, tile, "green");
      } else if (wordle.includes(data)) {
        addColorToTileAndKeyBoard(data, tile, "orange");
      } else {
        addColorToTileAndKeyBoard(data, tile, "gray");
      }
      tile.classList.add("animate-flip");
    }, 300 * index);
  });
};

/**
 * Game is finished
 * @param {*} status is won or lose
 */
const gameFinished = (status) => {
  createCardContainer(status);
};

const createCardContainer = (status) => {
  document.getElementById("game-container").classList.add("hidden");
  const cardContainer = document.createElement("div");
  cardContainer.setAttribute("id", "card-container");
  cardContainer.setAttribute(
    "class",
    "h-screen flex justify-center items-center"
  );
  document.body.append(cardContainer);
  createCard(cardContainer, status);
};

const createCard = (parent, status) => {
  const card = document.createElement("div");
  card.setAttribute("class", "rounded-md w-96 overflow-hidden");
  createCardTitle(card, status);
  createCardBody(card);
  newGameButton(card);
  parent.append(card);
};

const createCardTitle = (parent, status) => {
  const cardTitle = document.createElement("div");
  cardTitle.setAttribute(
    "class",
    "bg-orange-500 w-full text-white font-semibold text-2xl text-center py-2"
  );
  cardTitle.textContent = status;
  parent.append(cardTitle);
};

const createCardBody = (parent) => {
  const cardBody = document.createElement("div");
  cardBody.setAttribute(
    "class",
    "flex flex-col justify-center items-center bg-white py-4 space-y-2"
  );
  createPTag(cardBody);
  answer(cardBody);
  parent.append(cardBody);
};

const createPTag = (parent) => {
  const pTag = document.createElement("p");
  pTag.setAttribute("class", "text-xl font-semibold");
  pTag.textContent = "The answer is";
  parent.append(pTag);
};

const answer = (parent) => {
  const answer = document.createElement("div");
  answer.setAttribute(
    "class",
    "px-4 py-2 bg-gray-200 border border-black rounded-md border-dashed text-lg"
  );
  answer.textContent = wordle;
  parent.append(answer);
};

const newGameButton = (parent) => {
  const buttonElement = document.createElement("button");
  buttonElement.setAttribute(
    "class",
    "w-full px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-700 font-semibold "
  );
  buttonElement.setAttribute("id", "new-game");
  buttonElement.textContent = "New Game";
  buttonElement.addEventListener("click", () => newGame());
  parent.append(buttonElement);
};

/**
 * Play new Game
 */
const newGame = () => {
  const gameContainer = document.getElementById("game-container");
  gameContainer.remove();
  const cardContainer = document.getElementById("card-container");
  cardContainer.remove();
  init();
  currentCol = 0;
  currentRow = 0;
  isGameOver = false;
  canClick = true;
};

/**
 * Checking guessing answer is right or wrong
 * @param {*} numOfLetters is how many letters in the tile display
 * @param {*} triedCount is how many times we can guess
 */
const checkRow = async (numOfLetters, triedCount) => {
  if (currentRow < triedCount && currentCol == numOfLetters) {
    document.getElementById("give-up").classList.remove("hidden");
    let guess = "";
    const rowValues = document.getElementById(`row-${currentRow}`).childNodes;
    for (let i = 0; i < rowValues.length; i++) {
      guess += rowValues[i].innerText;
    }
    canClick = false;
    await checkDictionary(guess);
    if (valid) {
      flipTile(rowValues);
      setTimeout(() => {
        if (guess == wordle) {
          isGameOver = true;
          gameFinished("You Win🏆");
          return;
        } else if (currentRow >= triedCount) {
          isGameOver = true;
          gameFinished("You Lose😔");
          return;
        }
      }, 1600);
      console.log(guess);
      currentRow++;
      currentCol = 0;
    } else {
      alert("No Word Found");
    }
  }
  canClick = true;
};

/**
 * Handling Click
 * @param {*} key is which letter is clicked
 * @param {*} numOfLetters is how many letters in the tile display
 * @param {*} triedCount is how many times we can guess
 * @returns
 */
const handleClick = (key, numOfLetters, triedCount) => {
  if (!isGameOver && canClick) {
    if (key == "<<") {
      deleteOneLetter();
      return;
    } else if (key == "ENTER") {
      checkRow(numOfLetters, triedCount);
      return;
    } else {
      addOneLetter(key, numOfLetters, triedCount);
    }
  }
};

const howToPlayButton = (parent) => {
  const text = document.createElement("div");
  text.textContent = "?";
  text.setAttribute(
    "class",
    "w-6 h-6 font-semibold text-lg absolute right-0 rounded-full border border-black flex items-center justify-center bg-white p-2 cursor-pointer hover:bg-green-100 hover:text-green-500 hover:border-green-500"
  );
  text.addEventListener("click", () => howToPlay());
  parent.append(text);
};

const howToPlay = () => {
  howToPlayContainer();
};

const howToPlayContainer = () => {
  document.getElementById("game-container").classList.add("hidden");
  const div = document.createElement("div");
  div.setAttribute("class", "container mx-auto mt-8");
  div.setAttribute("id", "how-to-play-container");
  document.body.append(div);
  howToPlayTitleContainer(div);
  howToPlayBodyContainer(div);
};

const howToPlayTitleContainer = (parent) => {
  const container = document.createElement("div");
  container.setAttribute(
    "class",
    "w-[500px] mx-auto bg-sky-100 relative flex items-center justify-between rounded-md px-4 py-2"
  );
  howToPlayTitle(container);
  closeHowToPlayButton(container);
  parent.append(container);
};

const howToPlayTitle = (parent) => {
  const title = document.createElement("h1");
  title.setAttribute("class", "text-xl text-center font-semibold");
  title.textContent = "How to Play";
  parent.append(title);
};

const closeHowToPlayButton = (parent) => {
  const close = document.createElement("div");
  close.setAttribute("class", "cursor-pointer font-semibold text-xl");
  close.textContent = "x";
  close.addEventListener("click", () => closeHowToPlay());
  parent.append(close);
};

const closeHowToPlay = () => {
  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("how-to-play-container").remove();
};

const howToPlayBodyContainer = (parent) => {
  const div = document.createElement("div");
  div.setAttribute(
    "class",
    "mt-4 flex flex-col justify-center items-center w-full mx-auto"
  );
  howToPlayPTag(div);
  parent.append(div);
};

const howToPlayPTag = (parent) => {
  const p = document.createElement("p");
  p.setAttribute("class", "text-center text-lg text-gray-700");
  p.textContent = `You have to guess the hidden word in 6 tries and the color of the letters changes to show how close you are.\n If bg color gray, the current letter isn't in the target word at all.\n If bg color orange, the current letter is in the word but in the wrong spot.\n If bg color green, the current letter is in the word and in the correct spot.`;
  parent.append(p);
};

const checkDictionary = async (guess) => {
  const url = `https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=${guess}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "dictionary-by-api-ninjas.p.rapidapi.com",
    },
  };
  console.log("guess", guess);
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const json = JSON.parse(result);
    valid = json.valid;
  } catch (error) {
    console.error(error);
  }
};

const getWordle = async () => {
  const url = "https://random-words5.p.rapidapi.com/getRandom?wordLength=5";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    wordle = result.toUpperCase();
    console.log(wordle);
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  loadingText();
  await getWordle();
  createGameContainer();
};

const loadingText = () => {
  const load = document.createElement("div");
  load.setAttribute(
    "class",
    "h-screen flex items-center justify-center px-4 py-2 bg-white rounded-md text-4xl"
  );
  load.setAttribute("id", "loading");
  load.textContent = "Loading...";
  document.body.append(load);
};

init();
