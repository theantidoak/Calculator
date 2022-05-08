const buttons = document.querySelectorAll("button");
const numbers = document.querySelectorAll("[data-key]");
const newInput = document.querySelector("#input-div");
const oldInput = document.querySelector("#old-inputs");
const operators = ["÷", "×", "−", "+"];

let oldInputTextNode;
let currentValue;
let squareArray = [];
let numArray = [];
let answer;
let newNumber;
let operator;
let oldAnswer;
let oldOperator;
let indexOperator;
let topFunction;

/* If true, Equal function was just used, allowing the answer to be manipulated */
let equalFlag = false;
/* If true, there is an open bracket, changing the normal operation */
let bracketFlag = false;
/* If true, only operateAndEquate & clearAll will call*/
let operateEquateFlag = false;


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
    currentValue = this.value;
  }

  if (currentValue < 10 || currentValue == ".") {
    if (Array.from(newInput.textContent).includes(".") && 
      currentValue == "." && !operator) return;
    writeNumber();
  }

  if (currentValue == "-") {
    toggleNegative();
  }

  if (currentValue == "clear") {
    clearAll();
    operateEquateFlag = false;
  }

  if (currentValue == "delete") {
    if ((operateEquateFlag && !numArray.includes('^') && 
    numArray[numArray.length-1] != ")" && numArray[numArray.length-1] != "(") || 
    numArray.length == 0 || equalFlag) return;
    deleteLast();
    
  }

  if (currentValue == "(" || currentValue == ")") {
    useParenthesis();
  }

  if ((!bracketFlag && isNaN(numArray.join('')) && !numArray.includes(')')) ||
    (numArray.length == 0 && operator == undefined)) return;

    
  /* Top Functions */
  if (((currentValue == "^" && !numArray.includes('^')) || currentValue == "√" || 
   currentValue == "F_n" || currentValue == "!") && !bracketFlag) {
    calculateTopFunction();
    operateEquateFlag = true;
  }

  /* Change current operator before calculation */
  if (numArray.length == 0 && operators.some((op) => op == currentValue) &&
  operators.some((op) => op == operator)) {
    operator = currentValue;
    if (!operators.some(op => op == oldInput.lastChild.textContent.trim())) {
      oldInputTextNode = document.createTextNode(newNumber + " " + currentValue + " ");
      oldInput.replaceChild(oldInputTextNode, oldInput.lastChild);
    } else {
      oldInputTextNode = document.createTextNode(currentValue + " ");
      oldInput.replaceChild(oldInputTextNode, oldInput.lastChild);
    }
    return;
  }

  /* Use equal sign or operator */
  if ((currentValue == "=" || operators.some((op) => op == currentValue)) &&
      numArray[numArray.length - 1] != "^") {
    if (numArray.length == 1 && numArray[0] == '(') return;
    operateAndEquate();
    operateEquateFlag = false;
  }
}


function clearAll() {
  newInput.textContent = "";
  oldInput.textContent = "";
  
  topFunction = undefined;
  numArray = [];
  squareArray = [];
  answer = undefined;
  newNumber = undefined;
  operator = undefined;
  oldAnswer = undefined;
  oldOperator = undefined;
  indexOperator = undefined;
  oldInputTextNode = undefined;
  equalFlag = false;
  bracketFlag = false;
  operateEquateFlag = false;
}


function deleteLast() {
  const pop = numArray.pop();
  if (pop == ')' || pop == '(') {
    bracketFlag = !bracketFlag;
    if (pop == '(') {
      answer = oldAnswer;
      oldOperator = undefined;
    } else {
      operateEquateFlag = false;
    }
  } else if (operators.some(op => op == pop)) {
    operator = oldOperator;
  } else if (pop == "^") {
    if (oldOperator) {
      operator = [...oldInput.textContent].filter((op) => {
        let arr = [];
        if (operators.includes(op)) {
          return arr.push(op);
        }
      }).slice(-1).join();
      answer = oldAnswer;
      oldOperator = undefined;
    } else {
      operator = undefined;
      answer = undefined;
    }
    operateEquateFlag = false;
  }
  newInput.textContent = numArray.join("");
}


function writeNumber() {
  if (equalFlag) {
    if (currentValue == ".") {
    numArray = [answer];
    } else {
    numArray = [];
    newInput.textContent = '';
    }
    equalFlag = false;
    answer = undefined;
    operateEquateFlag = false;
    topFunction = undefined;
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
      numArray = [numArray];
    } else {
      numArray.unshift(currentValue);
    }
    answer = answer * -1;
    newInput.textContent = numArray.join("");
  }
}


function useParenthesis() {
  if (currentValue == ")" && operators.some(op => numArray.includes(op)) && 
  numArray.includes("(") && !isNaN(numArray[numArray.length - 1]) && !equalFlag) {
    indexOperator = numArray.indexOf(operator);
    answer = parseFloat(numArray.slice(numArray.indexOf("(") + 1, indexOperator).join(""));
    numArray.push(currentValue);
    operateEquateFlag = true;
    bracketFlag = !bracketFlag;
  } else if ((currentValue == "(" && numArray.length == 0) && !bracketFlag) {
    oldOperator = operator;
    numArray.push(currentValue);
    bracketFlag = !bracketFlag;
  } else if ((currentValue == "(") && equalFlag){
    numArray = ['(', answer];
    bracketFlag = !bracketFlag;
    topFunction = undefined;
    equalFlag = false;
  }
  newInput.textContent = numArray.join("");
}


function calculateTopFunction() {
  if (!equalFlag) {
    answer = parseFloat(numArray.join(""));
    if (!operators.some((op) => op == operator) && currentValue != '^') {
      equalFlag = true;
    }
  }
  if (topFunction) {
    topFunction = undefined;
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
      newNumber = answer;
      answer = parseFloat(stringToNumber[currentValue](answer, newNumber));
      oldInputTextNode = document.createTextNode(newNumber + currentValue + " ");
      break;
    case "√":
      newNumber = answer;
      answer = parseFloat(stringToNumber[currentValue](answer, newNumber));
      oldInputTextNode = document.createTextNode(currentValue + newNumber + " ");
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
      newNumber = stringToNumber[currentValue](answer, newNumber).join(" ");
      answer = parseFloat(newNumber.split(' ')[newNumber.split(' ').length - 1]);
      oldInputTextNode = document.createTextNode(" ");
      break;
  }
  if (currentValue != "^") {
    oldInput.appendChild(oldInputTextNode);
    topFunction = currentValue;
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
  const operation = currentValue == "=" ? false : true;
  /* operation : currentValue == operator */
  /* !operation : currentValue == "=" */

  if (operation){
    if (bracketFlag && numArray.some((op) => operators.includes(op))) return;
  } else {
    if (equalFlag || bracketFlag || numArray.length == 0) return;
  }

  /* Calculate */
  if (bracketFlag) {
    answer = numArray.join("");
  } else if (answer == undefined) {
    answer = parseFloat(numArray.join(""));
    newNumber = answer;
  } else if (!equalFlag) {
    
    if (numArray[numArray.length - 1] == ")" || numArray.includes('^')) {
      newNumber = parseFloat(numArray.slice(indexOperator + 1).join(""));
      squareArray.push(newNumber);
      if (oldOperator) {
        answer = parseFloat(stringToNumber[operator](answer, newNumber));
      }
    } else {
      newNumber = parseFloat(numArray.join(""));
    }
    if (oldOperator) {
      newNumber = answer;
      answer = oldAnswer;
      operator = oldOperator;
    }
    


    answer = parseFloat(stringToNumber[operator](answer, newNumber));

    if (answer.toString().includes('.')) {
      answer = round(answer);
    }
  }
   
  /* Display oldInput */
  if (topFunction == '√' || topFunction == '!' || topFunction == 'F_n') {
    if (operation && !oldOperator) {
      oldInputTextNode = document.createTextNode(answer + ' ');
      oldInput.appendChild(oldInputTextNode);
    }
    oldInputTextNode = document.createTextNode(currentValue + " ");
    oldInput.appendChild(oldInputTextNode);
    topFunction = undefined;
  } else if (numArray.includes("^")) {
    oldInputTextNode = document.createTextNode(squareArray.join("") + ' ' + 
    currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if (operation && (equalFlag || (numArray[numArray.length - 1] == ')' && !oldOperator))) {
    oldInputTextNode = document.createTextNode(answer + ' ' + currentValue + ' ');
    oldInput.appendChild(oldInputTextNode);
  } else if ((!bracketFlag && operation) || 
    (numArray[numArray.length - 1] != ")" && !operation) ||
    (numArray[numArray.length - 1] == ")" && oldOperator)) {
      oldInputTextNode = document.createTextNode(newNumber + " " + currentValue + " ");
      oldInput.appendChild(oldInputTextNode);
  }
  if (!operation) {
    oldInputTextNode = document.createTextNode(answer + " " + "|" + " ");
    oldInput.appendChild(oldInputTextNode);
  }

  /* Display newInput */
  if (operation && bracketFlag) {
    numArray.push(currentValue);
    newInput.textContent = numArray.join("");
  } else if (isNaN(answer) || answer == Infinity) {
    clearAll();
    newInput.textContent = "Error";
  } else {
    newInput.textContent = answer;
  }

  /* Prepare for next Calculation */
  if (operation && !bracketFlag) {
    oldAnswer = answer;
    numArray = [];
    oldOperator = undefined;
  }
  if (operation) {
    operator = currentValue;
    squareArray = [];
    equalFlag = false;
  } else {
    oldAnswer = answer;
    newNumber = answer;
    operator = undefined;
    oldOperator = undefined;
    bracketFlag = false;
    equalFlag = true;
    squareArray = [];
    numArray = [0];
  }
}

function round(roundNumber) {
  roundNumber = roundNumber.toPrecision(12).split('');
  while (roundNumber[roundNumber.length-1] == 0) {
      roundNumber.pop();
  }
  roundNumber = parseFloat(roundNumber.join(''));
  return roundNumber;
}