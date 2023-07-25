var gameStarted = false;
var currentBox = -1;
var row = 0;

console.log(`
██╗    ██╗ ██████╗ ██████╗ ██████╗ ██╗     ███████╗
██║    ██║██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝
██║ █╗ ██║██║   ██║██████╔╝██║  ██║██║     █████╗  
██║███╗██║██║   ██║██╔══██╗██║  ██║██║     ██╔══╝  
╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝███████╗███████╗
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
                                                                            
                                  
If you're interested in the source code, you can find it here:
https://github.com/pdt1806/erg-wordle

Please don't cheat using this console, the game is more fun if you don't!
`);

const unfocus = () => {
  document.activeElement.blur();
};

const backspace = (key = "Backspace") => {
  if (key === "Backspace" && currentBox > -1 && currentBox > row * 5 - 1) {
    document.getElementById("box" + currentBox).classList.add("none");
    document
      .getElementById("box" + currentBox)
      .classList.remove("noneWithText");
    document.getElementById("box" + currentBox).classList.remove("zoomOut");
    document.getElementById("box" + currentBox).querySelector("p").textContent =
      "";
    currentBox--;
  }
};

const enter = async (key = "Enter") => {
  if (key === "Enter" && currentBox > -1) {
    var fault = document.getElementById("fault");
    var word = "";

    const procedure = async () => {
      fault.classList.remove("hide");
      fault.classList.remove("fadeOut");
      document.getElementById("row" + row).classList.add("shake");
      await sleep(1000);
      fault.classList.add("fadeOut");
      await sleep(190);
      fault.classList.add("hide");
      document.getElementById("row" + row).classList.remove("shake");
    };

    for (let i = row * 5; i < row * 5 + 5; i++) {
      word += document.getElementById("box" + i).querySelector("p").textContent;
    }
    if (word.length < 5 && currentBox != row * 5 - 1) {
      fault.textContent = "Not enough letters!";
      procedure();
      return;
    } else if (
      !window.words.includes(word.toLowerCase()) &&
      currentBox != row * 5 - 1
    ) {
      fault.textContent = "Not in word list!";
      procedure();
      return;
    } else if (currentBox == row * 5 + 4) {
      checkWord(word);
    }
  }
};

const letter = (key) => {
  if (!gameStarted) {
    gameStarted = true;
    window.start = Date.now();
  }
  if (/^[a-zA-Z]$/.test(key) && currentBox < row * 5 + 4) {
    currentBox++;
    document.getElementById("box" + currentBox).querySelector("p").textContent =
      key.toUpperCase();
    document.getElementById("box" + currentBox).classList.remove("none");
    document.getElementById("box" + currentBox).classList.add("noneWithText");
    document.getElementById("box" + currentBox).classList.add("zoomOut");
  }
};

document.onkeydown = function (e) {
  backspace(e.key);
  enter(e.key);
  letter(e.key);
};

// game logic here

const pick_word = () => {
  fetch("lib/words.txt")
    .then((response) => response.text())
    .then((text) => {
      window.words = text.split("\n");
      window.word =
        window.words[
          Math.floor(Math.random() * window.words.length)
        ].toUpperCase();
    });
};

pick_word();

const checkWord = async (value) => {
  wordDic = {};
  keysList = [];
  for (let i = 0; i < 5; i++) {
    wordDic[window.word.charAt(i)] = charcount(
      window.word,
      window.word.charAt(i)
    );
  }

  for (let i = 0; i < 5; i++) {
    var indicator = row * 5 + i;
    var element = document.getElementById("box" + indicator);
    keysList.push(document.getElementById("key" + value.charAt(i)));
    element.classList.remove("noneWithText");
    if (value.charAt(i) === window.word.charAt(i)) {
      wordDic[value.charAt(i)]--;
      element.classList.add("green");
    } else if (wordDic.hasOwnProperty(value.charAt(i))) {
      var isAfter = false;
      for (let j = i + 1; j < 5; j++) {
        if (
          window.word.charAt(j) === value.charAt(i) &&
          window.word.charAt(j) === value.charAt(j)
        ) {
          element.classList.add("grey");
          isAfter = true;
          break;
        }
      }
      if (wordDic[value.charAt(i)] === 0) {
        element.classList.add("grey");
      } else if (!isAfter) {
        element.classList.add("yellow");
        wordDic[value.charAt(i)]--;
      }
    } else {
      element.classList.add("grey");
    }
    await sleep(400);
  }
  if (value === window.word) {
    const totalTime = Date.now() - window.start;
    for (let i = 0; i < 5; i++) {
      document
        .getElementById("box" + (row * 5 + i))
        .classList.remove("zoomOut");
      document
        .getElementById("box" + (row * 5 + i))
        .classList.add("greenWithoutAnimation");
      document.getElementById("box" + (row * 5 + i)).classList.remove("green");
      document.getElementById("box" + (row * 5 + i)).classList.add("win");
      await sleep(100);
    }
    await sleep(1000);
    result(true, totalTime);
    return;
  }
  if (row === 5 && value !== window.word) {
    result(false);
    return;
  }
  row++;
  for (let j = 0; j < keysList.length; j++) {
    if (keysList[j].querySelector("p").textContent === window.word.charAt(j)) {
      keysList[j].classList.remove("light-grey");
      keysList[j].classList.remove("yellow");
      keysList[j].classList.add("green");
    } else if (
      wordDic.hasOwnProperty(keysList[j].querySelector("p").textContent)
    ) {
      keysList[j].classList.remove("light-grey");
      keysList[j].classList.contains("green")
        ? null
        : keysList[j].classList.add("yellow");
    } else {
      keysList[j].classList.remove("light-grey");
      keysList[j].classList.add("grey");
    }
  }
};

const charcount = (word, letter) => {
  var letter_Count = 0;
  for (var position = 0; position < word.length; position++) {
    if (word.charAt(position) == letter) {
      letter_Count += 1;
    }
  }
  return letter_Count;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY));
};

const result = (status, totalTime = 0) => {
  if (!status) {
    document.getElementById("result").querySelector("h1").textContent =
      "You lose!";
    document.getElementById("resultTop").textContent = "The word was";
    document.getElementById("time").textContent = window.word;
    document.getElementById("resultBottom").textContent = "";
    document.getElementById("black-overlay").classList.remove("hide");
    document.getElementById("result").classList.remove("hide");
    document
      .getElementById("black-overlay")
      .classList.add("fadeInForBlackOverlay");
    document.getElementById("result").classList.add("fadeIn");
    return;
  }
  const seconds = Math.floor(totalTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const time = `${
    minutes !== 0 ? minutes + ` minute${minutes > 1 ? "s" : ""} and ` : ""
  } ${seconds % 60} second${seconds % 60 > 1 ? "s" : ""}`;
  document.getElementById("result").querySelector("h1").textContent =
    "You win!";
  document.getElementById("resultTop").textContent = "It took you";
  document.getElementById("time").textContent = time;
  document.getElementById("resultBottom").textContent = "to guess the word!";
  document.getElementById("black-overlay").classList.remove("hide");
  document.getElementById("result").classList.remove("hide");
  document
    .getElementById("black-overlay")
    .classList.add("fadeInForBlackOverlay");
  document.getElementById("result").classList.add("fadeIn");
};

const dispose = async () => {
  document
    .getElementById("black-overlay")
    .classList.remove("fadeInForBlackOverlay");
  document.getElementById("result").classList.remove("fadeIn");
  document.getElementById("black-overlay").classList.add("fadeOut");
  document.getElementById("result").classList.add("fadeOut");
  await sleep(190);
  document.getElementById("black-overlay").classList.add("hide");
  document.getElementById("result").classList.add("hide");
};

const reset = async () => {
  gameStarted = false;
  window.word = "";
  window.words = [];
  pick_word();
  row = 0;
  currentBox = -1;
  for (let i = 0; i < 30; i++) {
    document
      .getElementById("box" + i)
      .classList.remove("greenWithoutAnimation");
    document.getElementById("box" + i).classList.remove("win");
    document.getElementById("box" + i).classList.remove("zoomOut");
    document.getElementById("box" + i).classList.remove("green");
    document.getElementById("box" + i).classList.remove("yellow");
    document.getElementById("box" + i).classList.remove("grey");
    document.getElementById("box" + i).classList.add("none");
    document.getElementById("box" + i).querySelector("p").textContent = "";
  }
  for (let i = 0; i < 26; i++) {
    document
      .getElementById("key" + String.fromCharCode(65 + i))
      .classList.remove("green");
    document
      .getElementById("key" + String.fromCharCode(65 + i))
      .classList.remove("yellow");
    document
      .getElementById("key" + String.fromCharCode(65 + i))
      .classList.remove("grey");
    document
      .getElementById("key" + String.fromCharCode(65 + i))
      .classList.add("light-grey");
  }
  dispose();
};
