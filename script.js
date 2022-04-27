const newInput = document.querySelector("#input-div");
const oldInput = document.querySelector("#old-inputs");
const buttons = document.querySelectorAll("button");
const operators = ["÷", "×", "−", "+",];
const numbers = document.querySelectorAll('[data-key]');

let currentValue;

buttons.forEach((button) => button.addEventListener("click", calculate));
window.addEventListener('keydown', calculate);

let numArray = [];
let answer;
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


function calculate(e) {
  if (e.keyCode && [...numbers].some(number => number.dataset.key == e.keyCode)) {
    if (e.shiftKey) {
      if (e.keyCode == 49) {
        currentValue = '!';
      } else if (e.keyCode == 53) {
        currentValue = 'Fn';
      } else if (e.keyCode == 54) {
        currentValue = '^';
      } else if (e.keyCode == 55) {
        currentValue = '√';
      } else if (e.keyCode == 56) {
        currentValue = '×';
      } else if (e.keyCode == 57) {
        currentValue = '(';
      } else if (e.keyCode == 48) {
        currentValue = ')';
      }
    } else {
      currentValue = [...numbers].filter(number => number.dataset.key == e.keyCode)[0].value;
    }
  } else {
    currentValue = this.value;
  }

  if (currentValue < 10 || currentValue == '.') {
    makeNumber();
  }

  if (currentValue == '(' || currentValue == ')') {
    useParenthesis();
  }

  if (currentValue == "-") {
    toggleNegative();
  }

  if (currentValue == "clear" || operator == 'Fn') {
    clearAll();
  }

  if (currentValue == "delete") {
    numArray.pop();
    newInput.textContent = numArray.join("");
    bracketValue = undefined;
    if (previousValue == ')') {
      bracketFlag = !bracketFlag;
    }
  }

  if (numArray.length == 0 && operators.some(op => op == currentValue) &&
    operators.some(op => op == previousValue)) {
      operator = currentValue;
      oldInput.removeChild(oldInput.lastChild);
      oldInputTextNode = document.createTextNode(`${oldNumber}` + ' ' + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    }
  
  if (numArray.length == 0 || previousValue == currentValue) return;

  if (currentValue == "^" && !operatorFlag && !bracketFlag
    || (operator == "^" && currentValue == "=")) {
      square();
  }

  if (currentValue == "√" && !operatorFlag && !bracketFlag) {
    findSquareRoot();
  }
  
  if (currentValue == "Fn" && !operatorFlag && !bracketFlag) {
    fibonacci();
  }

  if (currentValue == '!' && !operatorFlag && !bracketFlag) {
    factorial();
  }

  if (!equalFlag && currentValue == "=" && operator != "^" && !operatorFlag && !bracketFlag) {
    equate();
  }

  if (operators.some((op) => op == currentValue)) {
    operate();
  }
  previousValue = this.value;
}

// Brackets
function useParenthesis() {
  if (equalFlag) {
    clearAll();
  }
  if (numArray.includes('(') && numArray.includes(')')) return;
  if (currentValue == ')') {
    if (!numArray.includes('(') || previousValue == currentValue) return;
    bracketValue = ')';
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
  "Fn": function (x, y) {
    let output = [1, 1];
    y = 0;
    if (x < 0) return "OOPS";
    for (let i = 2; i < x; i++) {
      output.push(output[i - 2] + output[i - 1]);
    }
    if (x == 0) {
      output = [1];
    }
    return output;
  },
  "!": function (x, y) {
    const factArray = [];
    y = 0;
    while (x > 0) {
      factArray.unshift(x);
      x--;
    };
    while (x < 0) {
      factArray.unshift(x);
      x++;
    };
    return factArray.reduce((start, next) => next == 0 ? 1 : start*next, 1);
  },
};

// Square the number
function square() {
  if (operators.some(op => op == operator)) {
    oldNumber = answer;
    oldOperator = operator;
    answer = parseFloat(numArray.join(""));
    oldInputTextNode = document.createTextNode(answer + ' ' + '^' + ' ');
    numArray = [answer, currentValue];
    newInput.textContent = answer + currentValue;
    oldInput.appendChild(oldInputTextNode);
    operator = '';
    return;
  } else if (equalFlag) {
    oldInputTextNode = document.createTextNode(
      `${answer}` + `${currentValue}`);
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
  if (operators.some(op => op == operator)) {
    answer = parseFloat(numArray.join(""));
    oldInputTextNode = document.createTextNode('√' + answer + ' ' + '=' + ' ');
    num = 1;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    numArray = [answer];
    newInput.textContent = answer;
    oldInput.appendChild(oldInputTextNode);
    answer = oldNumber;
    return;
  } else if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    num = 1;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(`${currentValue}` + " " + 
      `${oldInputTextNode}` + " " + "=" + " " + 
      `${answer}` + " ");
    equalFlag = true;
  } else if (equalFlag) {
    num = 1;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${currentValue}` + `${oldInputTextNode}` + " " + "=" + " " +
      `${answer}` + " ");
  }
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
}

// Calculate fibonacci sequence
function fibonacci() {
  if (operators.some(op => op == operator)) return;
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
  } 
  num = 0;
  oldInputTextNode = answer;
  if (answer > 1477) {
    clearAll();
    newInput.textContent = 'Maximum: 1477';
    return;
  }
  answer = stringToNumber[currentValue](answer, num).join(' ');
  oldInputTextNode = document.createTextNode(
    `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " ");
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
  operator = 'Fn';
}

// Calculate Factorial
function factorial() {
  if (operators.some(op => op == operator)) {
    answer = parseFloat(numArray.join(""));
    firstAnswer = answer;
    num = 0;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode('!' + firstAnswer + 
      ' ' + '='+ ' ' + `${oldNumber + answer}` + ' ');
    numArray = [answer];
    newInput.textContent = answer;
    oldInput.appendChild(oldInputTextNode);
    answer = oldNumber;
    return;
  } else if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (answer > 170 || answer < -170) {
      clearAll();
      newInput.textContent = 'Maximum: 170';
      return;
    }
    num = 0;
    oldInputTextNode = answer;
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " ");
    equalFlag = true;
  } else if (equalFlag) {
    num = 0;
    oldInputTextNode = answer;
    if (answer > 170 || answer < -170) {
      clearAll();
      newInput.textContent = 'Maximum: 170';
      return;
    }
    answer = parseFloat(stringToNumber[currentValue](answer, num));
    oldInputTextNode = document.createTextNode(
      `${oldInputTextNode}` + `${currentValue}` + " " + "=" + " ");
  }
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
}

// Create a Number and/or decimal
function makeNumber() {
  if (numArray.includes('.') & currentValue == '.') return;
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
  if (bracketValue == ')') {
    indexBracket1 = numArray.indexOf('(');
    indexOperator = numArray.indexOf(operator);
    indexBracket2 = numArray.indexOf(')');
    answer = parseFloat(numArray.slice((indexBracket1 + 1), (indexOperator)).join(''));
    num = parseFloat(numArray.slice((indexOperator + 1), (indexBracket2)).join(''));
    answer = parseFloat(stringToNumber[operator](answer, num));
    num = answer;
    if (oldOperator) {
      answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
    }
    newInput.textContent = answer;
    numArray = [0];
    equalFlag = true;
    bracketValue = 'oldInput';
    bracketFlag = false;
    return;
  } else if (oldOperator) {
    num = previousValue;
    operator = "^";
    answer = parseFloat(stringToNumber[operator](answer, num));
    num = answer;
    answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
    newInput.textContent = answer;
    oldOperator = undefined;
    numArray = [0];
    equalFlag = true;
    operatorFlag = false;
    operator = undefined;
    return;
  }
  num = parseFloat(numArray.join(""));
  answer = parseFloat(stringToNumber[operator](answer, num));
  oldInputTextNode = document.createTextNode(
    `${num}` + " " + `${currentValue}` + " "
  );
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
  if (bracketFlag && numArray.some(item => operators.includes(item))) return;
  // Equation
  if (bracketFlag) {
    answer = numArray.join("");
  } else if (answer == undefined) {
    answer = parseFloat(numArray.join(""));
    num = answer;
  } else if (!equalFlag) {
    if (operatorFlag) {
      equalFlag = true;
    } else if (previousValue == ')') {
      indexBracket1 = numArray.indexOf('(');
      indexOperator = numArray.indexOf(operator);
      indexBracket2 = numArray.indexOf(')');
      answer = parseFloat(numArray.slice((indexBracket1 + 1), (indexOperator)).join(''));
      num = parseFloat(numArray.slice((indexOperator + 1), (indexBracket2)).join(''));
      answer = parseFloat(stringToNumber[operator](answer, num));
      num = answer;
      if (oldOperator) {
        answer = parseFloat(stringToNumber[oldOperator](oldNumber, num));
      }
    } else {
      if (oldOperator) {
        num = previousValue;
        operator = "^";
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
        if (numArray.includes('^')) {
          indexBracket1 = numArray.indexOf('^');
          num = numArray.slice((indexBracket1 + 1))
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
      oldInputTextNode = document.createTextNode(`${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    } else if (bracketValue == 'oldInput') {
      oldInputTextNode = document.createTextNode(
        `${num}` + " " + '=' + ' ' + `${answer}` + " " + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    } else if (squareFlag) {
      ///HERE
      oldInputTextNode = document.createTextNode(
        `${numArray}` + " " + "=" + " " + answer + " " + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
      squareFlag = false;
      numArray = [0];
    } else {
      oldInputTextNode = document.createTextNode(
        `${answer}` + " " + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
    }
    equalFlag = false;
  } else if (!bracketFlag) {
    if (previousValue == ')') {
      oldInputTextNode = document.createTextNode(`${num}` + " " + '=' + ' ' + 
      `${answer}` + " " + `${currentValue}` + " ");
      oldInput.appendChild(oldInputTextNode);
      bracketValue = undefined;
    } else {
      oldInputTextNode = document.createTextNode(
        `${num}` + " " + `${currentValue}` + " ");
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