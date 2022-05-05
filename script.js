const newInput = document.querySelector("#input-div");
const oldInput = document.querySelector("#old-inputs");
const buttons = document.querySelectorAll("button");
const operators = ["÷", "×", "−", "+"];
const numbers = document.querySelectorAll("[data-key]");

// Values
let currentValue;
let previousValue;
// For each calculation
let numArray = [];
let answer;
let num;
let operator;
// If chain of operations
let oldNumber;
let oldOperator;
// For parenthesis
let bracketValue;
let indexBracket1;
let indexBracket2;
let indexOperator;
// For square
let squareArray = [];


//Flags

/* If true, Equal function was just used */
let equalFlag = false;
/* If true, Operator function was just used */
let operatorFlag = false;
/* If true, Open Parenthesis exists but not Closed Parenthesis */
let bracketFlag = false;
/* If true, Only equate, operate, & clearAll can be used */
let operateEquateFlag = false;


// Math functions
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
    y = 1;
    console.log(x);
    console.log(y);
    return Math.sqrt(x) * y;
  },
  'F_n': function (x, y) {
    let output = [1, 1];
    y = 0;
    if (x < 0) return "OOPS";
    for (let i = 2; i < x; i++) {
      output.push(output[i - 2] + output[i - 1]);
    }
    if (x == 0) {
      output = [0];
    } else if (x == 1) {
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
    return factArray.reduce((start, next) => (next == 0 ? 1 : start * next), 1) + y;
  }
};

buttons.forEach((button) => button.addEventListener("click", calculate));
window.addEventListener("keydown", calculate);

/* Master Function to call each button */
function calculate(e) {

  // Use keydown to operate the calculator
  if (e.keyCode && [...numbers].some((number) => number.dataset.key == e.keyCode)) {
    if (e.shiftKey) {
      if (e.keyCode == 49) {
        currentValue = "!";
      } else if (e.keyCode == 53) {
        currentValue = "F_n";
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
        (number) => number.dataset.key == e.keyCode)[0].value;
    }
  } else {
    // Using buttons to operate the Calculator
    currentValue = this.value;
  }

  /* Choose a number or decimal */
  if (currentValue < 10 || currentValue == ".") {
    if (numArray.includes('^')) {
      operateEquateFlag = false;
    }
    if (operateEquateFlag || (numArray.includes(".") && currentValue == ".")) return;
    makeNumber();
    operatorFlag = false;
  }
  
  /* Choose a parenthesis */
  if (currentValue == "(" || currentValue == ")") {
    if (operateEquateFlag || 
      (numArray[numArray.length - 1] == "^") ||
      (numArray.includes("(") && numArray.includes(")")) ||
      (previousValue == currentValue)) return;
    useParenthesis();
    bracketFlag = !bracketFlag;
  }

  /* Make negative */
  if (currentValue == "-") {
    if (operateEquateFlag) return;
    toggleNegative();
  }

  /* Clear all and return variables to undefined */
  if (currentValue == "clear") {
    clearAll();
    operateEquateFlag = false;
  }

  /* Delete one character */
  if (currentValue == "delete") {

    if ((operateEquateFlag && numArray.includes('(')) || numArray.length == 0 ||
      equalFlag || ((num == 0 && !equalFlag) || (num == 0 && operateEquateFlag)) || 
      ((num == 1 && equalFlag) || (num == 1 && operateEquateFlag))) return;

    deleteLast();
  }

  /* If an operator is selected, then immediately another operator is selected,
    change the operator and oldInput to reflect the new operator */
  if (
    numArray.length == 0 &&
    operators.some((op) => op == currentValue) &&
    operators.some((op) => op == previousValue)
  ) {
    operator = currentValue;
    oldInput.removeChild(oldInput.lastChild);
    oldInputTextNode = document.createTextNode(oldNumber + " " + currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
  }

  /* Don't allow the same operator or functions to run more than once */
  if (numArray.length == 0 || previousValue == currentValue) return;

  if ((currentValue == "^" && !operatorFlag && !bracketFlag)) {
    if (operateEquateFlag || numArray.includes('^')) return;
    square();
    operateEquateFlag = true;
    equalFlag = false;
  }

  /* Find the square root */
  if (currentValue == "√" && !operatorFlag && !bracketFlag) {
    if (operateEquateFlag || numArray.includes('^')) return;
    findSquareRoot();
    operateEquateFlag = true;
  }

  /* Display the fibonacci sequence up to the input number */
  if (currentValue == "F_n" && !operatorFlag && !bracketFlag) {
    if (operateEquateFlag) return;
    fibonacci();
    operateEquateFlag = true;
  }

  /* Run the factorial */
  if (currentValue == "!" && !operatorFlag && !bracketFlag) {
    if (operateEquateFlag || numArray.includes('^')) return;
    factorial();
    operateEquateFlag = true;
  }

  /* Use equal sign */
  if (!equalFlag && currentValue == "=" && !operatorFlag && !bracketFlag &&
      numArray[numArray.length - 1] != "^") {
    equate();
    operateEquateFlag = false;
  }

  /* Use operators, display answers as large text and previous operations/answers
    above as small text */
  if (operators.some((op) => op == currentValue)) {
    operate();
    operateEquateFlag = false;
  }
  previousValue = this.value;
}


function clearAll() {
  newInput.textContent = "";
  oldInput.textContent = "";
  
  previousValue = undefined;
  numArray = [];
  squareArray = [];
  answer = undefined;
  num = undefined;
  operator = undefined;
  oldNumber = undefined;
  oldOperator = undefined;
  bracketValue = undefined;
  indexBracket1 = undefined;
  indexBracket2 = undefined;
  indexOperator = undefined;
  equalFlag = false;
  operatorFlag = false;
  bracketFlag = false;
  operateEquateFlag = false;
}


function deleteLast() {
  let pop = numArray.pop();
  if (pop == ')' || pop == '(') {
    bracketFlag = !bracketFlag;
    bracketValue = undefined;
    if (pop == '(') {
      answer = undefined;
    }
  } else if (operators.some(op => op == pop)) {
    operator = undefined;
  } else if (pop == "^") {
    if (oldOperator) {
      operator = [...oldInput.textContent].filter((op) => {
        let arr = [];
        if (operators.includes(op)) {
          return arr.push(op);
        }
      }).slice(-1).join();
      answer = oldNumber;
      oldOperator = undefined;
    } else {
      operator = undefined;
      answer = undefined;
    }
    operateEquateFlag = false;
  }
  previousValue = 'delete';
  newInput.textContent = numArray.join("");
}


function useParenthesis() {
  if (equalFlag) return;
  
  if (currentValue == ")" && previousValue != "(" && numArray.includes("(")) {
    bracketValue = ")";
    indexBracket1 = numArray.indexOf("(");
    indexOperator = numArray.indexOf(operator);
    answer = parseFloat(numArray.slice(indexBracket1 + 1, indexOperator).join(""));
  } else if (currentValue == "(" && previousValue != ")" && isNaN(previousValue)) {
    oldOperator = operator;
  }
  
  numArray.push(currentValue);
  newInput.textContent = numArray.join("");
}


function square() {
  if (operators.some((op) => op == operator)) {
    oldNumber = answer;
    oldOperator = operator;
  }
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
  }
  newInput.textContent = answer + currentValue;
  numArray = [answer, currentValue];
  indexOperator = numArray.indexOf("^");
  operator = currentValue;
  squareArray = [answer, operator];
}


function findSquareRoot() {
  num = 1;

  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (!operators.some((op) => op == operator)) {
      equalFlag = true;
    }
  }
  num = answer;
  answer = parseFloat(stringToNumber[currentValue](answer, num));
  if (operators.some((op) => op == operator)) {
    oldInputTextNode = document.createTextNode("√" + num + " ");
    oldOperator = operator;
  } else {
    oldInputTextNode = document.createTextNode(
      currentValue + num + " " + "=" + " " + answer + " " + "|" + " ");
  } 
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
  operator = currentValue;
  numArray = [answer];
  console.log(equalFlag);
}


// Calculate Factorial
function factorial() {
  num = 1;

  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (!operators.some((op) => op == operator)) {
      equalFlag = true;
    }
  }
  if (answer > 170 || answer < -170) {
    clearAll();
    newInput.textContent = "Maximum: 170";
    return;
  }
  num = answer;
  answer = parseFloat(stringToNumber[currentValue](answer, num));
  if (operators.some((op) => op == operator)) {
    oldInputTextNode = document.createTextNode(num + "!" + " ");
    oldOperator = operator;
  } else {
    oldInputTextNode = document.createTextNode(
      num + currentValue + " " + "=" + " " + answer + " " + "|" + " ");
  } 
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = answer;
  operator = currentValue;
  numArray = [answer];
}


// Calculate fibonacci sequence
function fibonacci() {
  
  let fibonacci = document.createElement('sub');
  num = 0;
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (!operators.some((op) => op == operator)) {
      equalFlag = true;
    }
  }
  if (answer > 1477) {
    clearAll();
    newInput.textContent = "Maximum: 1477";
    return;
  }
  oldInputTextNode = document.createTextNode(answer);
  fibonacci.appendChild(oldInputTextNode);
  oldInputTextNode = document.createTextNode('F');
  oldInput.appendChild(oldInputTextNode);
  oldInput.appendChild(fibonacci);
  num = stringToNumber[currentValue](answer, num).join(" ");
  answer = parseFloat(num.split(' ')[num.split(' ').length - 1]);
  if (operators.some((op) => op == operator)) {
    oldInputTextNode = document.createTextNode(" ");
    oldOperator = operator;
  } else {
    oldInputTextNode = document.createTextNode(" " + "=" + " " + answer + ' ' + "|" + ' ');
  }
  oldInput.appendChild(oldInputTextNode);
  newInput.textContent = num;
  operator = currentValue;
  numArray = [answer]; 
}


function makeNumber() {
  if (equalFlag && currentValue == '.') return;
  if (equalFlag) {
    clearAll();
  }
  numArray.push(currentValue);
  newInput.textContent = numArray.join("");
}


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
      answer = answer * -1
      newInput.textContent = numArray;
    } else {
      numArray.unshift(currentValue);
      answer = answer * -1;
      newInput.textContent = numArray.join("");
    }
  }
}


function equate() {
  
  /* Calculating */
  if (bracketValue == ")" || numArray.includes('^')) {
    num = parseFloat(numArray.slice(indexOperator + 1).join(""));
    squareArray.push(num);
    if (oldOperator) {
      answer = parseFloat(stringToNumber[operator](answer, num));
    }
  } else {
    num = parseFloat(numArray.join(""));
  }
  if (oldOperator) {
    num = answer;
    answer = oldNumber;
    operator = oldOperator;
  }

  answer = parseFloat(stringToNumber[operator](answer, num)); 
  
  /* oldInputs */
  if (previousValue == '√' || previousValue == '!' || previousValue == 'F_n') {
    oldInputTextNode = document.createTextNode(currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
  } else if (numArray.includes("^")) {
    oldInputTextNode = document.createTextNode(squareArray.join("") + ' ' +  
      currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (bracketValue != ")" || (bracketValue == ")" && oldOperator)) {
    oldInputTextNode = document.createTextNode(num + " " + currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
  }
  oldInputTextNode = document.createTextNode(answer + " " + "|" + " ");
  oldInput.appendChild(oldInputTextNode);

  /* newInputs */
  if (isNaN(answer) || answer == Infinity) {
    clearAll();
    newInput.textContent = "Error";
  } else {
    newInput.textContent = answer;
  }

  operator = undefined;
  oldOperator = undefined;
  bracketValue = "closed";
  bracketFlag = false;
  operatorFlag = false;
  equalFlag = true;
  squareArray = [];
  numArray = [];
}

function operate() {
  if (numArray[numArray.length - 1] == "^") return;
  if (bracketFlag && numArray.some((item) => operators.includes(item))) return;

  /* Calculating */
  if (bracketFlag) {
    answer = numArray.join("");
  } else if (answer == undefined) {
    answer = parseFloat(numArray.join(""));
    num = answer;
  } else if (!equalFlag) {
    if (bracketValue == ")" || numArray.includes('^')) {
      num = parseFloat(numArray.slice(indexOperator + 1).join(""));
      squareArray.push(num);
      bracketValue = undefined;
      if (oldOperator) {
        answer = parseFloat(stringToNumber[operator](answer, num));
      }
    } else {
      num = parseFloat(numArray.join(""));
    }
    if (oldOperator) {
      num = answer;
      answer = oldNumber;
      operator = oldOperator;
    }
    answer = parseFloat(stringToNumber[operator](answer, num)); 
  }

  
  /* oldInputs */
  if (previousValue == '√' || previousValue == '!' || previousValue == 'F_n') {
    if (!oldOperator) {
      oldInputTextNode = document.createTextNode(answer + ' ');
      oldInput.appendChild(oldInputTextNode);
    }
    oldInputTextNode = document.createTextNode(currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (numArray.includes("^")) {
    oldInputTextNode = document.createTextNode(squareArray.join("") + ' ' + 
    currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (equalFlag || (previousValue == ')' && !oldOperator)) {
    oldInputTextNode = document.createTextNode(answer + ' ' + currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (!bracketFlag || (previousValue == ')' && oldOperator)) {
    oldInputTextNode = document.createTextNode(num + ' ' + currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  }

  /* newInputs */
  if (bracketFlag) {
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  } else if (isNaN(answer) || answer == Infinity) {
    clearAll();
    newInput.textContent = "Error";
  } else {
    newInput.textContent = answer;
    oldNumber = answer;
    numArray = [];
    oldOperator = undefined;
  }
  operator = currentValue;
  squareArray = [];
  operatorFlag = true;
  equalFlag = false;
}