const newInput = document.querySelector("#input-div");
const oldInput = document.querySelector("#old-inputs");
const buttons = document.querySelectorAll("button");
const operators = ["÷", "×", "−", "+"];
const numbers = document.querySelectorAll("[data-key]");

let currentValue;
let numArray = [];
let answer;
let num;
let operator;
let equalFlag = false;
let operatorFlag = false;
let bracketFlag = false;
let bracketValue;
let oldNumber;
let oldOperator;
let previousValue;
let indexBracket1;
let indexBracket2;
let indexOperator;
let squareFlag = false;
let numbEquateFlag = false;

buttons.forEach((button) => button.addEventListener("click", calculate));
window.addEventListener("keydown", calculate);

function calculate(e) {
  if (
    e.keyCode &&
    [...numbers].some((number) => number.dataset.key == e.keyCode)
  ) {
    if (e.shiftKey) {
      if (e.keyCode == 49) {
        currentValue = "!";
      } else if (e.keyCode == 53) {
        currentValue = "Fn";
      } else if (e.keyCode == 54) {
        currentValue = "^";
      } else if (e.keyCode == 55) {
        currentValue = "√";
      } else if (e.keyCode == 56) {
        currentValue = "×";
      } else if (e.keyCode == 57) {
        currentValue = "(";
      } else if (e.keyCode == 48) {
        currentValue = ")";
      }
    } else {
      currentValue = [...numbers].filter(
        (number) => number.dataset.key == e.keyCode
      )[0].value;
    }
  } else {
    currentValue = this.value;
  }

  if (currentValue < 10 || currentValue == ".") {
    if (numArray.includes('^')) {
      numbEquateFlag = false;
    }
    if (numbEquateFlag) return;
    makeNumber();
  }

  if (currentValue == "(" || currentValue == ")") {
    if (numbEquateFlag) return;
    useParenthesis();
  }

  if (currentValue == "-") {
    if (numbEquateFlag) return;
    toggleNegative();
  }

  if (currentValue == "clear" || operator == "Fn") {
    clearAll();
    numbEquateFlag = false;
  }

  if (currentValue == "delete") {

    if ((!numbEquateFlag && !numArray.includes('(')) || numArray.length == 0 ||
      equalFlag || ((num == 0 && equalFlag != true) || (num == 0 && numbEquateFlag)) || 
      ((num == 1 && equalFlag) || (num == 1 && numbEquateFlag))) {
      return;
    }

    let pop = numArray.pop();
    
    if (pop == ')' || pop == '(') {
      bracketFlag = !bracketFlag;
      bracketValue = undefined;
    }

    if (operators.some(op => op == pop)) {
      operator = undefined;
    }

    if (pop == "^") {
      numbEquateFlag = false;
      operator = undefined;
      answer = undefined;
    }

    newInput.textContent = numArray.join("");
    return;
  }

  if (
    numArray.length == 0 &&
    operators.some((op) => op == currentValue) &&
    operators.some((op) => op == previousValue)
  ) {
    operator = currentValue;
    oldInput.removeChild(oldInput.lastChild);
    oldInputTextNode = document.createTextNode(
      `${oldNumber}` + " " + `${currentValue}` + " "
    );
    oldInput.appendChild(oldInputTextNode);
  }

  if (numArray.length == 0 || previousValue == currentValue) return;

  if (
    (currentValue == "^" && !operatorFlag && !bracketFlag) ||
    (operator == "^" && currentValue == "=")
  ) {
    if (numbEquateFlag) return;
    square();
  }

  if (currentValue == "√" && !operatorFlag && !bracketFlag) {
    if (numbEquateFlag || numArray.includes('^')) return;
    findSquareRoot();
  }

  if (currentValue == "Fn" && !operatorFlag && !bracketFlag) {
    if (numbEquateFlag) return;
    fibonacci();
  }

  if (currentValue == "!" && !operatorFlag && !bracketFlag) {
    if (numbEquateFlag || numArray.includes('^')) return;
    factorial();
  }

  if (
    !equalFlag &&
    currentValue == "=" &&
    operator != "^" &&
    !operatorFlag &&
    !bracketFlag
  ) {
    equate();
    numbEquateFlag = false;
  }

  if (operators.some((op) => op == currentValue)) {
    operate();
    numbEquateFlag = false;
  }
  previousValue = this.value;
}

// Brackets
function useParenthesis() {
  if (equalFlag) {
    clearAll();
  }
  if (numArray.includes("(") && numArray.includes(")")) return;
  if (currentValue == ")") {
    if (!numArray.includes("(") || previousValue == currentValue) return;
    bracketValue = ")";
  } else {
    if (!isNaN(previousValue) || previousValue == currentValue) return;
    oldOperator = operator;
  }
  numArray.push(currentValue);
  newInput.textContent = numArray.join("");
  bracketFlag = !bracketFlag;
}

function clearAll() {
  newInput.textContent = "";
  oldInput.textContent = "";
  operator = undefined;
  numArray = [];
  answer = undefined;
  equalFlag = false;
  operatorFlag = false;
  oldOperator = undefined;
  bracketFlag = false;
  bracketValue = undefined;
  oldNumber = undefined;
  previousValue = undefined;
}

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
  Fn: function (x, y) {
    let output = [1, 1];
    y = 0;
    if (x < 0) return "OOPS";
    for (let i = 2; i < x; i++) {
      output.push(output[i - 2] + output[i - 1]);
    }
    if (x == 0) {
      output = [1];
    }
    return output.reduce((a, b) => a.concat(b).concat(','), []).slice(0, -1);
  },
  "!": function (x, y) {
    const factArray = [];
    y = 0;
    while (x > 0) {
      factArray.unshift(x);
      x--;
    }
    while (x < 0) {
      factArray.unshift(x);
      x++;
    }
    return factArray.reduce((start, next) => (next == 0 ? 1 : start * next), 1);
  }
};

// Square the number
function square() {
  if (operators.some((op) => op == operator)) {
    oldNumber = answer;
    oldOperator = operator;
    answer = parseFloat(numArray.join(""));
    numArray = [answer, currentValue];
    newInput.textContent = answer + currentValue;
    operator = "";
    numbEquateFlag = true;
    return;
  } else if (equalFlag) {
    newInput.textContent = answer + currentValue;
    equalFlag = false;
    numArray = [answer, currentValue];
    operator = "^";
    numbEquateFlag = true;
  } else if (!equalFlag && operator == "^") {
    if (currentValue == '^') return;
    num = numArray.slice((numArray.indexOf("^") + 1));
    num = parseFloat(num.join(""));
    oldInputTextNode = document.createTextNode(answer + operator + num + ' ' + '=' + ' ');
    oldInput.appendChild(oldInputTextNode);
    answer = parseFloat(stringToNumber[operator](answer, num));
    oldInputTextNode = document.createTextNode(answer + " " + "|" + " ");
    oldInput.appendChild(oldInputTextNode);
    newInput.textContent = answer;
    equalFlag = true;
    numArray = [0];
    operator = undefined;
  } else {
    if (numArray.includes('^')) return;
    answer = parseFloat(newInput.textContent);
    operator = currentValue;
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
    numbEquateFlag = true;
  }
}

// Square Root
function findSquareRoot() {
  if (operators.some((op) => op == operator)) {
    answer = parseFloat(numArray.join(""));
    oldInputTextNode = document.createTextNode("√" + answer + " ");
    num = 1;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    numArray = [answer];
    newInput.textContent = answer;
    oldInput.appendChild(oldInputTextNode);
    answer = oldNumber;
    numbEquateFlag = true;
    return;
  } else if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    num = 1;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      currentValue + " " + oldInputTextNode + " " + "=" + 
        " " + answer + " " + "|" + " ");
    equalFlag = true;
  } else if (equalFlag) {
    num = 1;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      currentValue + oldInputTextNode + " " + "=" + " " + answer + " " + "|" + " ");
  }
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
}

// Calculate fibonacci sequence
function fibonacci() {
  if (operators.some((op) => op == operator)) return;
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
  }
  num = 0;
  oldInputTextNode = answer;
  if (answer > 1477) {
    clearAll();
    newInput.textContent = "Maximum: 1477";
    return;
  }
  answer = stringToNumber[currentValue](answer, num).join(" ");
  oldInputTextNode = document.createTextNode(
    `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " "
  );
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
  operator = "Fn";
}

// Calculate Factorial
function factorial() {
  if (operators.some((op) => op == operator)) {
    answer = parseFloat(numArray.join(""));
    firstAnswer = answer;
    num = 0;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(firstAnswer + "!" + " ");
    numArray = [answer];
    newInput.textContent = answer;
    oldInput.appendChild(oldInputTextNode);
    answer = oldNumber;
    numbEquateFlag = true;
    return;
  } else if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (answer > 170 || answer < -170) {
      clearAll();
      newInput.textContent = "Maximum: 170";
      return;
    }
    num = 0;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " " + answer + " " +
        "|" + " "
    );
    equalFlag = true;
  } else if (equalFlag) {
    num = 0;
    oldInputTextNode = answer;
    if (answer > 170 || answer < -170) {
      clearAll();
      newInput.textContent = "Maximum: 170";
      return;
    }
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " " + answer + " " +
      "|" + " "
    );
  }
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
  numArray = [0];
}

// Create a Number and/or decimal
function makeNumber() {
  if (numArray.includes(".") && (currentValue == ".")) return;
  if (equalFlag) {
    clearAll();
  }
  numArray.push(currentValue);
  newInput.textContent = numArray.join("");
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
  if (operator == undefined) return;
  if (bracketValue == ")") {
    indexBracket1 = numArray.indexOf("(");
    indexOperator = numArray.indexOf(operator);
    indexBracket2 = numArray.indexOf(")");
    answer = parseFloat(
      numArray.slice(indexBracket1 + 1, indexOperator).join("")
    );
    num = parseFloat(numArray.slice(indexOperator + 1, indexBracket2).join(""));
    
    answer = parseFloat(stringToNumber[operator](answer, num));
    oldInputTextNode = document.createTextNode(
      answer + " " + "=" + " ");
    num = answer;
    if (oldOperator) {
      answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
    }
    newInput.textContent = answer;
    oldInput.appendChild(oldInputTextNode);
    numArray = [0];
    equalFlag = true;
    bracketValue = "oldInput";
    bracketFlag = false;
    operator = undefined;
    return;
  } else if (oldOperator) {
    indexOperator = numArray.indexOf('^');
    num = parseFloat(numArray.slice((indexOperator + 1)).join(''));
    operator = "^";
    oldInputTextNode = document.createTextNode(answer + operator + num + ' ' + '=' + ' ');
    oldInput.appendChild(oldInputTextNode);
    answer = parseFloat(stringToNumber[operator](answer, num));
    num = answer;
    answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
    newInput.textContent = answer;
    oldInputTextNode = document.createTextNode(answer + ' ' + '|' + ' ');
    oldInput.appendChild(oldInputTextNode);
    oldOperator = undefined;
    numArray = [0];
    equalFlag = true;
    operatorFlag = false;
    operator = undefined;
    return;
  }
  num = parseFloat(numArray.join(""));
  answer = parseFloat(stringToNumber[operator](answer, num));
  if (previousValue == '√' || previousValue == '!') {
    oldInputTextNode = document.createTextNode(
      currentValue + " " + answer + " " + "|" + " "
    );
  } else {
    oldInputTextNode = document.createTextNode(
      num + " " + currentValue + " " + answer + " " + "|" + " "
    );
  }
  oldInput.appendChild(oldInputTextNode);
  if (isNaN(answer) || answer == Infinity) {
    clearAll();
    newInput.textContent = "Error";
  } else {
    newInput.textContent = answer;
  }
  numArray = [0];
  equalFlag = true;
  operatorFlag = false;
  operator = undefined;
}

// Use the operators
function operate() {
  if (bracketFlag && numArray.some((item) => operators.includes(item))) return;
  // Equation
  if (bracketFlag) {
    answer = numArray.join("");
  } else if (answer == undefined) {
    answer = parseFloat(numArray.join(""));
    num = answer;
  } else if (!equalFlag) {
    if (operatorFlag) {
      equalFlag = true;
    } else if (previousValue == ")") {
      indexBracket1 = numArray.indexOf("(");
      indexOperator = numArray.indexOf(operator);
      indexBracket2 = numArray.indexOf(")");
      answer = parseFloat(
        numArray.slice(indexBracket1 + 1, indexOperator).join("")
      );
      num = parseFloat(
        numArray.slice(indexOperator + 1, indexBracket2).join("")
      );
      answer = parseFloat(stringToNumber[operator](answer, num));
      num = answer;
      if (oldOperator) {
        answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
        oldOperator = undefined;
      }
    } else {
      if (oldOperator) {
        indexOperator = numArray.indexOf('^');
        num = parseFloat(numArray.slice((indexOperator + 1)).join(''));
        operator = "^";
        oldInputTextNode = document.createTextNode(answer + operator + num + ' ' + currentValue + ' ');
        oldInput.appendChild(oldInputTextNode);
        answer = parseFloat(stringToNumber[operator](answer, num));
        numArray = num;
        num = answer;
        answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
        newInput.textContent = answer;
        oldOperator = undefined;
        equalFlag = true;
        operator = undefined;
        squareFlag = true;
      } else {
        if (numArray.includes("^")) {
          oldNumber = answer;
          indexOperator = numArray.indexOf("^");
          num = parseFloat(numArray.slice(indexOperator + 1).join(''));
        } else {
          num = parseFloat(numArray.join(""));
        }
        answer = parseFloat(stringToNumber[operator](answer, num));
      }
    }
  }

  // oldInput Text
  if (equalFlag) {
    if (num == 1) {
      oldInputTextNode = document.createTextNode(
        answer + " " + currentValue + " "
      );
      oldInput.appendChild(oldInputTextNode);
    } else if (bracketValue == "oldInput") {
      oldInputTextNode = document.createTextNode(
        num + " " + "|" + " " + answer + " " + `${currentValue}` + " "
      );
      oldInput.appendChild(oldInputTextNode);
    } else if (squareFlag) {
      squareFlag = false;
      numArray = [0];
    } else {
      oldInputTextNode = document.createTextNode(
        answer + " " + currentValue + " ");
      oldInput.appendChild(oldInputTextNode);
    }
    equalFlag = false;
  } else if (!bracketFlag) {
    if (previousValue == ")") {
      oldInputTextNode = document.createTextNode(
        num + " " + currentValue + " "
      );
      oldInput.appendChild(oldInputTextNode);
      bracketValue = undefined;
    } else if (previousValue == "√") {
      oldInputTextNode = document.createTextNode(
        currentValue + " "
      );
      oldInput.appendChild(oldInputTextNode);
    } else {
      if (operator == "^") {
        oldInputTextNode = document.createTextNode(oldNumber + operator + num + ' ' + currentValue + ' ');
        oldNumber = undefined;
      } else if (previousValue == '!') {
        oldInputTextNode = document.createTextNode(currentValue + " ");
      } else {
        oldInputTextNode = document.createTextNode(
          num + " " + currentValue + " ");
      }
      oldInput.appendChild(oldInputTextNode);
    }
  }

  // newInput Text
  if (bracketFlag) {
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  } else if (isNaN(answer)) {
    clearAll();
    newInput.textContent = "Error";
  } else if (answer == Infinity) {
    clearAll();
    answer = 0;
    newInput.textContent = answer;
  } else {
    newInput.textContent = answer;
    oldNumber = answer;
  }

  if (!bracketFlag) {
    numArray = [];
  }
  operator = currentValue;
  operatorFlag = true;
}
