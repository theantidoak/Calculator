const inputDiv = document.querySelector("#input-div");
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
let previousNumString;
let operator;
let equalFlag = false;
let operatorFlag = false;
let currentValue;

function createFirstNum() {
  currentValue = this.value;

  // Clear Button
  if (currentValue == "clear") {
    start();
  }

  // Delete Button
  if (currentValue == "delete") {
    numArray.pop();
    inputDiv.textContent = numArray.join("");
  }

  if (currentValue == "^" || (operator == "^" && currentValue == "=")) {
    square();
  }

  // Square Root
  if (currentValue == "√") {
    findSquareRoot();
  }

  // Making it negative
  if (currentValue == "-") {
    makeNegative();
  }

  // Equals
  if (!equalFlag && currentValue == "=" && operator != "^" && !operatorFlag) {
    equate();
  }

  // Creating the inputDiv array
  if (currentValue < 10) {
    makeNumber();
  }

  // Operators
  if (operators.some((op) => op == currentValue)) {
    operate();
  }
}

function start() {
  inputDiv.textContent = "";
  oldInput.textContent = "";
  operator = undefined;
  numArray = [];
  previousNumString = undefined;
  equalFlag = false;
  operatorFlag = false;
}

function equate() {
  num = parseFloat(numArray.join(""));
  previousNumString = parseFloat(
    stringToNumber[operator](previousNumString, num)
  );
  previousInput = document.createTextNode(
    `${num}` + " " + `${currentValue}` + " "
  );
  oldInput.appendChild(previousInput);
  if (isNaN(previousNumString) || previousNumString == Infinity) {
    start();
    inputDiv.textContent = "Error";
    previousNumString == undefined;
  } else {
    inputDiv.textContent = previousNumString;
  }
  numArray = [0];
  equalFlag = true;
}

function clearAll() {
  if (currentValue == "clear") {
    start();
  }
}

function operate() {
  // Equation
  if (previousNumString == undefined) {
    previousNumString = parseFloat(numArray.join(""));
    num = previousNumString;
  } else if (!equalFlag) {
    if (operatorFlag) {
      equalFlag = true;
    } else {
      num = parseFloat(numArray.join(""));
      previousNumString = parseFloat(
        stringToNumber[operator](previousNumString, num)
      );
    }
  }

  // oldInput Text
  if (equalFlag) {
    if (num == 1) {
      previousInput = document.createTextNode(`${currentValue}` + " ");
      oldInput.appendChild(previousInput);
    } else {
      previousInput = document.createTextNode(
        `${previousNumString}` + " " + `${currentValue}` + " "
      );
      oldInput.appendChild(previousInput);
    }
    equalFlag = false;
  } else {
    previousInput = document.createTextNode(
      `${num}` + " " + `${currentValue}` + " "
    );
    oldInput.appendChild(previousInput);
  }

  // inputDiv Text
  if (isNaN(previousNumString)) {
    start();
    inputDiv.textContent = "Error";
  } else if (previousNumString == Infinity) {
    start();
    previousNumString = 0;
    inputDiv.textContent = previousNumString;
  } else {
    inputDiv.textContent = previousNumString;
  }

  numArray = [];
  operator = currentValue;
  operatorFlag = true;
}

function makeNumber() {
  if (equalFlag) {
    start();
    numArray.push(currentValue);
    inputDiv.textContent = numArray.join("");
  } else {
    numArray.push(currentValue);
    inputDiv.textContent = numArray.join("");
  }
  operatorFlag = false;
}

function makeNegative() {
  if (!equalFlag) {
    if (numArray[0] == "-") {
      numArray.shift();
    } else {
      numArray.unshift(currentValue);
    }
    inputDiv.textContent = numArray.join("");
  } else if (equalFlag) {
    numArray = [previousNumString];
    if (numArray[0] == "-" || previousNumString < 0) {
      numArray = numArray * -1;
      previousNumString = previousNumString * -1;
      inputDiv.textContent = numArray;
    } else {
      numArray.unshift(currentValue);
      previousNumString = -previousNumString;
      inputDiv.textContent = numArray.join("");
    }
  }
}

function square() {
  if (equalFlag && currentValue == "^") {
    previousInput = document.createTextNode(
      `${previousNumString}` + " " + `${currentValue}` + " "
    );
    oldInput.appendChild(previousInput);
    inputDiv.textContent = previousNumString + currentValue;
    equalFlag = false;
    numArray = [previousNumString, currentValue];
    operator = "^";
  } else if (currentValue == "^") {
    previousNumString = parseFloat(inputDiv.textContent);
    previousInput = document.createTextNode(
      `${previousNumString}` + " " + `${currentValue}` + " "
    );
    oldInput.appendChild(previousInput);
    operator = currentValue;
    numArray.push(currentValue);
    inputDiv.textContent = numArray.join("");
  } else if (operator == "^" && currentValue == "=" && !equalFlag) {
    let index = numArray.indexOf("^") + 1;
    num = numArray.splice(index);
    num = parseFloat(num.join(""));
    previousNumString = parseFloat(
      stringToNumber[operator](previousNumString, num)
    );
    previousInput = document.createTextNode(
      `${num}` + " " + "=" + " " + `${previousNumString}` + " " + "=" + " "
    );
    oldInput.appendChild(previousInput);
    inputDiv.textContent = previousNumString;
    equalFlag = true;
  }
}

function findSquareRoot() {
  if (!equalFlag) {
    previousNumString = parseFloat(numArray.join(""));
    previousInput = previousNumString;
    num = 1;
    previousNumString = parseFloat(
      stringToNumber[currentValue](previousNumString, num)
    );
    previousInput = document.createTextNode(
      `${currentValue}` +
        " " +
        `${previousInput}` +
        " " +
        "=" +
        " " +
        `${previousNumString}` +
        " "
    );
    oldInput.appendChild(previousInput);
    inputDiv.textContent = previousNumString;
    equalFlag = true;
  } else if (equalFlag) {
    num = 1;
    previousInput = previousNumString;
    previousNumString = parseFloat(
      stringToNumber[currentValue](previousNumString, num)
    );
    previousInput = document.createTextNode(
      `${currentValue}` +
        `${previousInput}` +
        " " +
        "=" +
        " " +
        `${previousNumString}` +
        " "
    );
    oldInput.appendChild(previousInput);
    inputDiv.textContent = previousNumString;
  }
}
