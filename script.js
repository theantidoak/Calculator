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
let indexOperator;
// For square
let squareArray = [];

let operation;


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
    useParenthesis();
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

  /* Top Functions */
  if (((currentValue == "^" || currentValue == "√" || currentValue == "F_n" ||
  currentValue == "!") && !operatorFlag && !bracketFlag)) {
    if (operateEquateFlag || numArray.includes('^')) return;
    calculateTopFunction();
    operateEquateFlag = true;
  }

  /* Use equal sign or operator */
  if ((currentValue == "=" || operators.some((op) => op == currentValue)) &&
      numArray[numArray.length - 1] != "^") {
    operateAndEquate();
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

function makeNumber() {
  if (equalFlag && currentValue == '.') return;
  if (equalFlag) {
    clearAll();
  }
  numArray.push(currentValue);
  newInput.textContent = numArray.join("");
}

function useParenthesis() {
  if (equalFlag) return;
  
  if (currentValue == ")" && operators.some(op => numArray.includes(op)) && 
  numArray.includes("(") && !isNaN(numArray[numArray.length - 1])) {
    bracketValue = ")";
    indexBracket1 = numArray.indexOf("(");
    indexOperator = numArray.indexOf(operator);
    answer = parseFloat(numArray.slice(indexBracket1 + 1, indexOperator).join(""));
    numArray.push(currentValue);
    operateEquateFlag = true;
    bracketFlag = !bracketFlag;
  } else if ((currentValue == "(" && operatorFlag) || 
  (currentValue == '(' && numArray.length == 0)) {
    if (numArray.includes("(")) return;
    oldOperator = operator;
    numArray.push(currentValue);
    bracketFlag = !bracketFlag;
  }
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
      numArray = [numArray];
    } else {
      numArray.unshift(currentValue);
    }
    answer = answer * -1;
    newInput.textContent = numArray.join("");
  }
}


function calculateTopFunction() {
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (!operators.some((op) => op == operator) && currentValue != '^') {
      equalFlag = true;
    }
  }
  switch (currentValue) {
    case "^":
      if (operators.some((op) => op == operator)) {
        oldOperator = operator;
      }
      newInput.textContent = answer + currentValue;
      numArray = [answer, currentValue];
      indexOperator = numArray.indexOf("^");
      operator = currentValue;
      squareArray = [answer, operator];
      equalFlag = false;
      break;
    case "!":
      if (answer > 170 || answer < -170) {
        clearAll();
        newInput.textContent = "Maximum: 170";
        return;
      }
      num = answer;
      answer = parseFloat(stringToNumber[currentValue](answer, num));
      oldInputTextNode = document.createTextNode(num + currentValue + " ");
      break;
    case "√":
      num = answer;
      answer = parseFloat(stringToNumber[currentValue](answer, num));
      oldInputTextNode = document.createTextNode(currentValue + num + " ");
      break;
    case "F_n":
      if (answer > 1477) {
        clearAll();
        newInput.textContent = "Maximum: 1477";
        return;
      }
      const fibonacci = document.createElement('sub');
      oldInputTextNode = document.createTextNode(answer);
      fibonacci.appendChild(oldInputTextNode);
      oldInputTextNode = document.createTextNode('F');
      oldInput.appendChild(oldInputTextNode);
      oldInput.appendChild(fibonacci);
      num = stringToNumber[currentValue](answer, num).join(" ");
      answer = parseFloat(num.split(' ')[num.split(' ').length - 1]);
      oldInputTextNode = document.createTextNode(" ");
      break;
  }
  if (currentValue != "^") {
    oldInput.appendChild(oldInputTextNode);
    if (operators.some((op) => op == operator)) {
      oldOperator = operator;
    } else {
      oldInputTextNode = document.createTextNode("=" + " " + answer + " " + "|" + " ");
      oldInput.appendChild(oldInputTextNode);
    }
    newInput.textContent = answer;
    operator = currentValue;
    numArray = [answer];
  }
}


function operateAndEquate() {
  currentValue == "=" ? operation = false : operation = true;

  if (operation){
    if (bracketFlag && numArray.some((item) => operators.includes(item))) return;
  } else {
    if (equalFlag || operatorFlag || bracketFlag) return;
  }

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
    if (operation && !oldOperator) {
      oldInputTextNode = document.createTextNode(answer + ' ');
      oldInput.appendChild(oldInputTextNode);
    }
    oldInputTextNode = document.createTextNode(currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
  } else if (numArray.includes("^")) {
    oldInputTextNode = document.createTextNode(squareArray.join("") + ' ' + 
    currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (operation && (equalFlag || (previousValue == ')' && !oldOperator))) {
    oldInputTextNode = document.createTextNode(answer + ' ' + currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if ((!bracketFlag && operation) || 
    (bracketValue != ")" && !operation) ||
    (previousValue == ')' && oldOperator)) {
    oldInputTextNode = document.createTextNode(num + " " + currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
  }
  if (!operation) {
    oldInputTextNode = document.createTextNode(answer + " " + "|" + " ");
    oldInput.appendChild(oldInputTextNode);
  }


  /* newInputs */
  if (operation && bracketFlag) {
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  } else if (isNaN(answer) || answer == Infinity) {
    clearAll();
    newInput.textContent = "Error";
  } else {
    newInput.textContent = answer;
  }

  if (operation && !bracketFlag) {
    oldNumber = answer;
    numArray = [];
    oldOperator = undefined;
  }
  
  if (operation) {
    operator = currentValue;
    squareArray = [];
    operatorFlag = true;
    equalFlag = false;
  } else {
    oldNumber = answer;
    operator = undefined;
    oldOperator = undefined;
    bracketFlag = false;
    operatorFlag = false;
    equalFlag = true;
    squareArray = [];
    numArray = [0];
  }
  bracketValue = undefined;
}