let isMoved = false;
let clonedElement = null;

const moveTds = () => {
  const mainGameTd = document.getElementById("maingame");
  const otherColumnTd = document.querySelector(".othercolumn");
  const firstTd = otherColumnTd.querySelector("div");

  if (firstTd && !isMoved) {
    clonedElement = firstTd.cloneNode(true);
    mainGameTd.appendChild(clonedElement);
    firstTd.style.display = "none";
    clonedElement.style.marginTop = "40px";
    clonedElement.style.marginBottom = "40px";
    isMoved = true;
  }
};

const moveBack = () => {
  const mainGameTd = document.getElementById("maingame");
  const otherColumnTd = document.querySelector(".othercolumn");

  if (clonedElement && isMoved) {
    mainGameTd.removeChild(mainGameTd.lastChild);
    const firstTd = otherColumnTd.querySelector("div");
    firstTd.style.display = "flex";
    isMoved = false;
  }
};

const checkWidth = () => {
  const specificWidth = 1000;
  if (window.innerWidth <= specificWidth) {
    moveTds();
  } else {
    moveBack();
  }
};

window.addEventListener("DOMContentLoaded", checkWidth);
window.addEventListener("resize", checkWidth);
