"use strict";

let balance = document.querySelector(".balance");

let state = "waiting";

function cookCoffee(price, name, elem) {
  if (state != "waiting") {
    return;
  }
  let buttonCup = elem.querySelector("img");
  let cupSrc = buttonCup.src;

  if (balance.value >= price) {
    balance.value -= price;
    balance.style.backgroundColor = "";
    changeDisplayText("Ваш " + name + " готовится");
    cup.changeCupImage(cupSrc);
    state = "cooking";
    startCooking();
  } else {
    changeDisplayText("Недостаточно средств");
    balance.style.backgroundColor = "rgb(255, 50, 50)";
  }
}

function startCooking() {
  if (state != "cooking") {
    return;
  }
  cup.showCup();
  changeProgress(100, 5);
  setTimeout(function () {
    state = "ready";
    changeDisplayText("Ваш кофе готов!");
    cup.toggleActive();
    cup.elem.onclick = function () {
      takeCoffee();
    };
  }, 5000);
}

function takeCoffee() {
  if (state != "ready") {
    return;
  }
  state = "waiting";
  changeProgress(0);
  cup.hideCup();
  changeDisplayText("Выберите кофе!");
  cup.toggleActive();
}

let cup = {
  elem: document.querySelector(".cup"),

  changeCupImage(src) {
    let cupImage = cup.elem.querySelector("img");
    cupImage.src = src;
  },

  showCup() {
    cup.elem.style.display = "block";
    cup.elem.style.transition = "opacity 5s";
    setTimeout(function () {
      cup.elem.style.opacity = "1";
    }, 10);
  },

  hideCup() {
    cup.elem.style.display = "none";
    cup.elem.style.opacity = "0";
  },

  toggleActive() {
    cup.elem.classList.toggle("pointer");
  },
};

function changeProgress(percent, sec = 0) {
  let progress = document.querySelector(".progress-bar");
  progress.style.width = percent + "%";
  progress.style.transition = `width ${sec}s`;
}

function changeDisplayText(text) {
  let displayText = document.querySelector(".display-text");
  if (text.length > 25) {
    displayText.innerHTML = text.slice(0, 25) + "...";
  } else {
    displayText.innerHTML = text;
  }
}

// Drog'n'Drop с купюрами

let bills = document.querySelectorAll(".money img");

for (let bill of bills) {
  bill.onmousedown = dragMoney;
}

function dragMoney(event) {
  event.preventDefault();
  let bill = this;
  let billCoords = bill.getBoundingClientRect();
  let billWidth = billCoords.width;
  let billHeight = billCoords.height;

  bill.style.position = "absolute";
  bill.style.transform = "rotate(90deg)";
  bill.style.top = event.clientY - billHeight / 2 + "px";
  bill.style.left = event.clientX - billWidth / 2 + "px";

  window.onmousemove = function (event) {
    bill.style.top = event.clientY - billHeight / 2 + "px";
    bill.style.left = event.clientX - billWidth / 2 + "px";
  };

  bill.onmouseup = function () {
    window.onmousemove = null;
    if (inAtm(bill)) {
      let cost = +bill.getAttribute("cost");
      balance.value = +balance.value + cost;
      bill.remove();
      eatBill(bill);
    } else {
      bill.style.transform = "rotate(0deg)";
    }
  };
}

// исчезновение купюры
function eatBill(bill) {
  let cashCatcher = document.querySelector(".cash-catcher");
  cashCatcher.append(bill);
  bill.style.position = "";
  bill.style.transition = "transform 3s";
  bill.style.transform = "translateY(50%) rotate(90deg)";
  setTimeout(function () {
    bill.style.transform = "translateY(-200%) rotate(90deg)";
    bill.ontransitionend = function () {
      console.log("Транзиция закончилась");
      bill.remove();
    };
  }, 10);
}

function inAtm(bill) {
  // будет проверять попала купюра в банкомат?
  let atm = document.querySelector(".atm img");
  let atmCoords = atm.getBoundingClientRect();
  // координаты банкомата
  let atmWidth = atmCoords.width;
  let atmHeight = atmCoords.height;

  let billCoords = bill.getBoundingClientRect();
  //  координаты купюры
  let billWidth = billCoords.width;
  let billHeight = billCoords.height;

  let atmLeftX = atmCoords.x;
  let atmTopY = atmCoords.y;
  let atmRightX = atmLeftX + atmWidth;
  let atmBottomY = atmTopY + atmHeight / 3;

  let billLeftX = billCoords.x;
  let billRightX = billCoords.x + billCoords.width;
  let billY = billCoords.y;

  if (
    billLeftX > atmLeftX &&
    billRightX < atmRightX &&
    billY > atmTopY &&
    billY < atmBottomY
  ) {
    return true;
  } else {
    return false;
  }
}

// ----------получение сдачи------------

let changeBtn = document.querySelector(".change-btn");
changeBtn.onclick = function () {
  takeChange();
};

function takeChange() {
  if (balance.value >= 10) {
    balance.value -= 10;
    createCoin("10");
    setTimeout(function () {
      takeChange();
    }, 300);
  } else if (balance.value >= 5) {
    balance.value -= 5;
    createCoin("5");
    setTimeout(function () {
      takeChange();
    }, 300);
  } else if (balance.value >= 2) {
    balance.value -= 2;
    createCoin("2");
    setTimeout(function () {
      takeChange();
    }, 300);
  } else if (balance.value >= 1) {
    balance.value -= 1;
    createCoin("1");
    setTimeout(function () {
      takeChange();
    }, 300);
  }
}

function createCoin(nominal) {
  let imageSrc = "";
  switch (nominal) {
    case "1":
      imageSrc = "img/1rub.png";
      break;
    case "2":
      imageSrc = "img/2rub.png";
      break;
    case "5":
      imageSrc = "img/5rub.png";
      break;
    case "10":
      imageSrc = "img/10rub.png";
      break;
  }
  let changeBox = document.querySelector(".change-box");
  let changeBoxCoords = changeBox.getBoundingClientRect();
  let changeBoxWidth = changeBoxCoords.width;
  let changeBoxHeight = changeBoxCoords.height;

  let coin = document.createElement("img");
  coin.src = imageSrc;
  coin.style.cursor = "pointer";
  coin.style.userSelector = "none";
  coin.style.width = "30px";
  coin.style.position = "absolute";
  coin.style.opacity = 0;
  coin.style.transform = "translateY(-75%)";
  coin.style.transition = "opacity .5s, transform .5s";
  coin.style.top = getRandomInt(0, changeBoxHeight - 30) + "px";
  coin.style.left = getRandomInt(0, changeBoxWidth - 30) + "px";

  setTimeout(function () {
    coin.style.opacity = 1;
    coin.style.transform = "translateY(0%)";
  }, 10);

  changeBox.append(coin);
  coin.onclick = function () {
    coin.remove();
  };

  let coinDropSound = new Audio("sound/coinDrop.mp3");
  coinDropSound.play();
  coinDropSound.volume = 0.01;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
