const newInput = document.querySelector("#input-div");
const oldInput = document.querySelector("#old-inputs");
const buttons = document.querySelectorAll("button");
const operators = ["÷", "×", "−", "+"];

buttons.forEach((button) => button.addEventListener("click", createFirstNum));

const stringToNumber = {
  "+": function (x, y) {
    return x + y;
  },
  "−": function (x, y) {
    return x - y;
  },
  "×": function (x, y) {
    return x * y;
  },
  "÷": function (x, y) {
    return x / y;
  },
  "^": function (x, y) {
    return x ** y;
  },
  "√": function (x, y) {
    return Math.sqrt(x) * y;
  },
  "!": function (x, y) {
    const output = [1, 1];
    if (x < 0) return "OOPS";
    for (let i = 2; i < x; i++) {
      output.push(output[i - 2] + output[i - 1]);
    }
    return output[x - 1] + y;
  }
};

let numArray = [];
let answer;
let operator;
let equalFlag = false;
let operatorFlag = false;
let currentValue;

function createFirstNum() {
  currentValue = this.value;

  if (currentValue == "clear") {
    start();
  }

  if (currentValue == "^" && !operatorFlag 
    || (operator == "^" && currentValue == "=")) {
    square();
  }

  if (currentValue == "√" && !operatorFlag) {
    findSquareRoot();
  }
  
  if (currentValue == "delete") {
    numArray.pop();
    newInput.textContent = numArray.join("");
  }

  if (currentValue < 10 || currentValue == '.') {
    makeNumber();
  }

  if (currentValue == "-") {
    toggleNegative();
  }

  if (!equalFlag && currentValue == "=" && operator != "^" && !operatorFlag) {
    equate();
  }

  if (operators.some((op) => op == currentValue)) {
    operate();
  }
}

function start() {
  newInput.textContent = "";
  oldInput.textContent = "";
  operator = undefined;
  numArray = [];
  answer = undefined;
  equalFlag = false;
  operatorFlag = false;
}

// Clear Button
function clearAll() {
  if (currentValue == "clear") {
    start();
  }
}

// Square the number
function square() {
  if (equalFlag) {
    oldInputTextNode = document.createTextNode(
      `${answer}` + " " + `${currentValue}` + " ");
    oldInput.appendChild(oldInputTextNode);
    newInput.textContent = answer + currentValue;
    equalFlag = false;
    numArray = [answer, currentValue];
    operator = "^";
  } else if (!equalFlag && operator == "^") {
    num = numArray.splice((numArray.indexOf("^") + 1));
    num = parseFloat(num.join(""));
    answer = parseFloat(stringToNumber[operator](answer, num));
    oldInputTextNode = document.createTextNode(
      `${num}` + " " + "=" + " " + `${answer}` + " " + "=" + " "
    );
    oldInput.appendChild(oldInputTextNode);
    newInput.textContent = answer;
    equalFlag = true;
  } else {
    answer = parseFloat(newInput.textContent);
    oldInputTextNode = document.createTextNode(
      `${answer}` + " " + `${currentValue}` + " "
    );
    oldInput.appendChild(oldInputTextNode);
    operator = currentValue;
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
    }
  }


// Square Root
function findSquareRoot() {
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    oldInputTextNode = answer;
    num = 1;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${currentValue}` + " " + `${oldInputTextNode}` + " " + "=" + " " + 
      `${answer}` + " " + "=" + " ");
    oldInput.appendChild(oldInputTextNode);
    newInput.textContent = answer;
    equalFlag = true;
  } else if (equalFlag) {
    num = 1;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${currentValue}` + `${oldInputTextNode}` + " " + "=" + " " +
      `${answer}` + " " + "=" + " ");
    oldInput.appendChild(oldInputTextNode);
    newInput.textContent = answer;
  }
}

// Create a Number and/or decimal
function makeNumber() {
  if (equalFlag) {
    start();
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  } else {
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  }
  operatorFlag = false;
}

// Toggle Negative sign
function toggleNegative() {
  if (!equalFlag) {
    if (numArray[0] == "-") {
      numArray.shift();
    } else {
      numArray.unshift(currentValue);
    }
    newInput.textContent = numArray.join("");
  } else if (equalFlag) {
    numArray = [answer];
    if (numArray[0] == "-" || answer < 0) {
      numArray = numArray * -1;
      answer = answer * -1;
      newInput.textContent = numArray;
    } else {
      numArray.unshift(currentValue);
      answer = -answer;
      newInput.textContent = numArray.join("");
    }
  }
}

// Use equal sign
function equate() {
  num = parseFloat(numArray.join(""));
  answer = parseFloat(stringToNumber[operator](answer, num));
  oldInputTextNode = document.createTextNode(
    `${num}` + " " + `${currentValue}` + " "
  );
  oldInput.appendChild(oldInputTextNode);
  if (isNaN(answer) || answer == Infinity) {
    start();
    newInput.textContent = "Error";
    answer == undefined;
  } else {
    newInput.textContent = answer;
  }
  numArray = [0];
  equalFlag = true;
  operatorFlag = false;
}

// Use the operators
function operate() {
  // Equation
  if (answer == undefined) {
    answer = parseFloat(numArray.join(""));
    num = answer;
  } else if (!equalFlag) {
    if (operatorFlag) {
      equalFlag = true;
    } else {
      num = parseFloat(numArray.join(""));
      answer = parseFloat(stringToNumber[operator](answer, num));
    }
  }

  // oldInput Text
  if (equalFlag) {
    if (num == 1) {
      oldInputTextNode = document.createTextNode(`${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    } else {
      oldInputTextNode = document.createTextNode(
        `${answer}` + " " + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    }
    equalFlag = false;
  } else {
    oldInputTextNode = document.createTextNode(
      `${num}` + " " + `${currentValue}` + " ");
    oldInput.appendChild(oldInputTextNode);
  }

  // newInput Text
  if (isNaN(answer)) {
    start();
    newInput.textContent = "Error";
  } else if (answer == Infinity) {
    start();
    answer = 0;
    newInput.textContent = answer;
  } else {
    newInput.textContent = answer;
  }

  numArray = [];
  operator = currentValue;
  operatorFlag = true;
}