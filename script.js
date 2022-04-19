const inputDiv = document.querySelector('#input-div');
const oldInput = document.querySelector('#old-inputs');
const buttons = document.querySelectorAll('button');
let previousValue = '';
let previousNum;
let currentNum;
let finale;
const symbols = ['√', '^', '÷', '×', '−', '+', '(', ')', '.'];

buttons.forEach(button => button.addEventListener('click', displayNumbers));
buttons.forEach(button => button.addEventListener('click', operate));

function displayNumbers() {
  let currentValue = this.value;
  const textNode = document.createTextNode(`${currentValue}`);

  if (previousValue == '√') {
    if (currentValue < 10) return;
    else if (symbols.some(symbol => symbol == currentValue)) {
      const textNode = document.createTextNode(`${currentValue}` + ' ');
      oldInput.append(textNode);
    }
    previousValue = '';
  } else if (previousValue == '=') {
    while (oldInput.firstChild) {
      oldInput.removeChild(oldInput.lastChild);
    }
  }

  if (currentValue == 'clear') {
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
    while (oldInput.firstChild) {
      oldInput.removeChild(oldInput.lastChild);
    }
  } else if (currentValue == 'delete') {
    inputDiv.removeChild(inputDiv.lastChild);
  } else if (currentValue == '=') {
    if (currentValue == previousValue) return;
    const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
    oldInput.append(textNode);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  } else if (inputDiv.textContent.includes('(') || inputDiv.textContent.includes(')')) {
    if (currentValue < 10 || symbols.some(symbol => symbol == currentValue)) {
      inputDiv.appendChild(textNode);
    }
  } else if (currentValue < 10 || currentValue == '(' || currentValue == ')' || currentValue == '.' || currentValue == '^') {
    inputDiv.appendChild(textNode);
  } else if (currentValue == '√') {
    const textNode = document.createTextNode(`${currentValue}`+`${inputDiv.textContent}` + ' ');
    oldInput.append(textNode);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  } else if (currentValue == '-') {
    inputDiv.textContent[0] != '-' ? 
    inputDiv.textContent = `${currentValue}` + inputDiv.textContent :
    inputDiv.textContent = inputDiv.textContent.substring(1);
  } else if (symbols.some(symbol => symbol == currentValue)) {
    if (symbols.includes(previousValue) || previousValue == '') return;
    const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
    oldInput.append(textNode);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  }
  previousValue = this.value;
  previousNum = oldInput.textContent.replace(/\s*[^0-9]*\s*/, '');
  currentNum = inputDiv.textContent;
  if (symbols.some(symbol => symbol == currentValue)) {
    previousSymbol = currentValue;
  }
}

let operator;
let oldNum;
let newNum;
let equation;
let solveFlag = false;
let solved;
let currentVal;

function operate() {
  currentVal = this.value;
  solved = makeEquation(previousNum);
  if (!isNaN(currentVal)) {
    newNum += currentVal;
    
    console.log(newNum);
  }
  if (newNum.includes('undefined')) {
    newNum = newNum.replace('undefined', '');
  }
  if (currentVal < 10 && equation == oldNum) {
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
    
    const textNode = document.createTextNode(`${currentVal}`);
    inputDiv.appendChild(textNode);
    equation = '';
  }

  if (symbols.some(symbol => symbol == currentVal)) {
    if (solveFlag) {
      newNum = parseInt(newNum);
      equation = stringToNumber[operator](oldNum, newNum);
      operator = this.value;
      const textNode = document.createTextNode(`${equation}`);
      inputDiv.appendChild(textNode);
      oldNum = parseInt(equation);
    } else if (!isNaN(solved)) {
      const textNode = document.createTextNode(`${solved}`);
      inputDiv.appendChild(textNode);
      oldNum = parseInt(solved);
      solveFlag = true;
      operator = this.value;
      equation = oldNum;
    } 
    newNum = '';
  } 
  
}

const stringToNumber = {
  '+': function(x, y) { return x + y},
  '−': function(x, y) { return x - y},
  '×': function(x, y) { return x * y},
  '÷': function(x, y) { return x / y},
};

function makeEquation(arg) {
  let array = arg.split(' ');
  for (let i = 0; i < array.length; i++) {
    let numCheck = array[i];
    if (isNaN(numCheck)) {
      let firstNum = parseInt(array[i-1]);
      let secondNum = parseInt(array[i+1]);
      return stringToNumber[numCheck](firstNum, secondNum);
    };
  }
}