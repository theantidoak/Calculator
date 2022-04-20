const inputDiv = document.querySelector('#input-div');
const oldInput = document.querySelector('#old-inputs');
const buttons = document.querySelectorAll('button');
let previousValue = '';
let previousNum;
let currentNum;
let finale;
const symbols = ['√', '^', '÷', '×', '−', '+', '(', ')'];
const operatorz = ['^', '÷', '×', '−', '+'];

// buttons.forEach(button => button.addEventListener('click', displayNumbers));
// buttons.forEach(button => button.addEventListener('click', operate));
buttons.forEach(button => button.addEventListener('click', createFirstNum));

// function displayNumbers() {
//   let currentValue = this.value;
//   const textNode = document.createTextNode(`${currentValue}`);

//   if (previousValue == '√') {
//     if (currentValue < 10) return;
//     else if (symbols.some(symbol => symbol == currentValue) || currentValue == '.') {
//       const textNode = document.createTextNode(`${currentValue}` + ' ');
//       oldInput.append(textNode);
//     }
//     previousValue = '';
//   } else if (previousValue == '=') {
//     while (oldInput.firstChild) {
//       oldInput.removeChild(oldInput.lastChild);
//     }
//   }

//   if (currentValue == 'clear') {
//     while (inputDiv.firstChild) {
//       inputDiv.removeChild(inputDiv.lastChild);
//     }
//     while (oldInput.firstChild) {
//       oldInput.removeChild(oldInput.lastChild);
//     }
//   } else if (currentValue == 'delete') {
//     inputDiv.removeChild(inputDiv.lastChild);
//   } else if (currentValue == '=') {
//     if (currentValue == previousValue) return;
//     const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
//     oldInput.append(textNode);
//     while (inputDiv.firstChild) {
//       inputDiv.removeChild(inputDiv.lastChild);
//     }
//   } else if (inputDiv.textContent.includes('(') || inputDiv.textContent.includes(')')) {
//     if (currentValue < 10 || symbols.some(symbol => symbol == currentValue) || currentValue == '.') {
//       inputDiv.appendChild(textNode);
//     }
//   } else if (currentValue < 10 || currentValue == '(' || currentValue == ')' || currentValue == '.' || currentValue == '^') {
//     inputDiv.appendChild(textNode);
//   } else if (currentValue == '√') {
//     const textNode = document.createTextNode(`${currentValue}`+`${inputDiv.textContent}` + ' ');
//     oldInput.append(textNode);
//     while (inputDiv.firstChild) {
//       inputDiv.removeChild(inputDiv.lastChild);
//     }
//   } else if (currentValue == '-') {
//     inputDiv.textContent[0] != '-' ? 
//     inputDiv.textContent = `${currentValue}` + inputDiv.textContent :
//     inputDiv.textContent = inputDiv.textContent.substring(1);
//   } else if (symbols.some(symbol => symbol == currentValue) || currentValue == '.') {
//     if (symbols.includes(previousValue) || previousValue == '') return;
//     const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
//     oldInput.append(textNode);
//     while (inputDiv.firstChild) {
//       inputDiv.removeChild(inputDiv.lastChild);
//     }
//   }
//   previousValue = this.value;
//   previousNum = oldInput.textContent.replace(/(^-)\s*(^-)[^0-9]*\s*/, '');
//   currentNum = inputDiv.textContent;
//   if (symbols.some(symbol => symbol == currentValue)) {
//     previousSymbol = currentValue;
//   }
// }

// let operator;
// let oldNum = 0;
// let newNum;
// let equation;
// let solveFlag = false;
// let solved;
// let currentVal;
// let oldValue;

// function operate() {
//   currentVal = this.value;

//   solved = makeEquation(previousNum);
//   if (!isNaN(currentVal)) {
//     if (currentVal != '.') {
//       newNum += currentVal;
//     } 
//     if (oldValue == '.') {
//       newNum = newNum.toString().replace(currentVal, '') + '.' + currentVal;
//     }
//     if (newNum.includes('undefined')) {
//       newNum = newNum.replace('undefined', '');
//     }
//   }
//   if (currentVal == '-') {
//     newNum = -newNum;
//   }
//   if (currentVal < 10 && equation == oldNum) {
    
//     while (inputDiv.firstChild) {
//       inputDiv.removeChild(inputDiv.lastChild);
//     }
    
//     const textNode = document.createTextNode(`${currentVal}`);
//     inputDiv.appendChild(textNode);
//     equation = '';
//   }

//   if (symbols.some(symbol => symbol == currentVal)) {
//     if (solveFlag) {
//       newNum = parseFloat(newNum);
//       equation = stringToNumber[operator](oldNum, newNum);
//       operator = this.value;
//       const textNode = document.createTextNode(`${equation}`);
//       inputDiv.appendChild(textNode);
//       oldNum = parseFloat(equation);
//     } else if (!isNaN(solved)) {
//       const textNode = document.createTextNode(`${solved}`);
//       inputDiv.appendChild(textNode);
//       oldNum = parseFloat(solved);
//       solveFlag = true;
//       operator = this.value;
//       equation = oldNum;
//     } 
//     newNum = 0;
//   } 
//   oldValue = this.value; 
// }

// function makeEquation(arg) {
//   let array = arg.split(' ');
//   for (let i = 0; i < array.length; i++) {
//     let numCheck = array[i];
//     if (isNaN(numCheck)) {
//       let firstNum = parseFloat(array[i-1]);
//       let secondNum = parseFloat(array[i+1]);
//       return stringToNumber[numCheck](firstNum, secondNum);
//     };
//   }
// }

const stringToNumber = {
  '+': function(x, y) { return x + y},
  '−': function(x, y) { return x - y},
  '×': function(x, y) { return x * y},
  '÷': function(x, y) { return x / y},
  '^': function(x, y) { return x ** y},
  '√': function(x, y) { return Math.sqrt(x) * y },
};

let numArray = [];
let previousNumString;
let operatorr;
let flag = false;
let operatorFlag = false;
start();

function createFirstNum() {
  const currentValue = this.value;
  
  if (currentValue == 'clear') {
    start();
  }

  if (currentValue == 'delete') {
    numArray.pop();
    inputDiv.textContent = numArray.join('');
  }

  if (currentValue < 10 || currentValue == '(' || currentValue == ')' 
  || currentValue == '.' || currentValue == '^') {
    if (flag) {
      start()
      numArray.push(currentValue);
      inputDiv.textContent = numArray.join('');
    } else {
      numArray.push(currentValue);
      inputDiv.textContent = numArray.join('');
    }
    operatorFlag = false;
  } 
  
  if (!flag && currentValue == '-') {
    if (numArray[0] == '-') {
      numArray.shift();
    } else {
      numArray.unshift(currentValue);
    }
    inputDiv.textContent = numArray.join('');
  // } else if (flag && currentValue == '-') {
  //   if (numArray[0] == '-') {
  //     numArray = [previousNumString];
  //     console.log(numArray);
  //     numArray.shift();
  //     inputDiv.textContent = numArray.join(' ');
  //   } else {
  //     numArray = [previousNumString];
  //     numArray.unshift(currentValue);
  //     inputDiv.textContent = numArray.join(' ');
  //   }
  }

  if (!flag && currentValue == "=") {
    num = parseFloat(numArray.join(''));
    previousNumString = parseFloat(stringToNumber[operatorr](previousNumString, num));
    previousInput = document.createTextNode(`${num}` + ' ' + `${currentValue}` + ' ');
    oldInput.append(previousInput);
    if (isNaN(previousNumString) || previousNumString == Infinity) {
      start();
      inputDiv.textContent = 'Error';
      previousNumString == undefined;
    } else {
      inputDiv.textContent = previousNumString;
    }
    numArray = [0];
    flag = true;
  }

  if (currentValue == '√' && !flag) {
    previousNumString = parseFloat(numArray.join(''));
    previousInput = previousNumString;
    num = 1;
    previousNumString = parseFloat(stringToNumber[currentValue](previousNumString, num));
    previousInput = document.createTextNode(`${currentValue}` + ' ' + `${previousInput}` + ' ');
    oldInput.append(previousInput);
    inputDiv.textContent = previousNumString;
    flag = true;
    return;
  } else if (currentValue == '√' && flag) {
    num = 1;
    previousInput = previousNumString;
    previousNumString = parseFloat(stringToNumber[currentValue](previousNumString, num));
    previousInput = document.createTextNode(`${currentValue}` + `${previousInput}` + ' ');
    oldInput.append(previousInput);
    inputDiv.textContent = previousNumString;
  }

  if (operatorz.some(op => op == currentValue)) {
    if (operatorFlag) return;

    if (previousNumString == undefined) {
      previousNumString = parseFloat(numArray.join(''));
      num = previousNumString;
    } else if (!flag) {
      num = parseFloat(numArray.join(''));
      previousNumString = parseFloat(stringToNumber[operatorr](previousNumString, num));
    }
    if (flag) {
      if (num == 1) {
        previousInput = document.createTextNode(`${currentValue}` + ' ');
        oldInput.append(previousInput);
      } else {
        previousInput = document.createTextNode(`${previousNumString}` + ' ' + `${currentValue}` + ' ');
        oldInput.append(previousInput);
      }
      flag = false;
    } else {
      previousInput = document.createTextNode(`${num}` + ' ' + `${currentValue}` + ' ');
      oldInput.append(previousInput);
    }
    
    if (isNaN(previousNumString)) {
      start();
      inputDiv.textContent = 'Error';
    } else if (previousNumString == Infinity) {
      start();
      previousNumString = 0;
      inputDiv.textContent = previousNumString;
    } else {
      inputDiv.textContent = previousNumString;
    }
    numArray = [];
    operatorr = currentValue;
    operatorFlag = true;
  }

  return previousNumString;
}


function start() {
  inputDiv.textContent = '';
  oldInput.textContent = '';
  operatorr = undefined;
  numArray = [];
  previousNumString = undefined;
  flag = false;
  operatorFlag = false;
}
