const inputDiv = document.querySelector('#input-div');
const oldInput = document.querySelector('#old-inputs');
const buttons = document.querySelectorAll('button');
let previousValue = '';
let previousNum;
let currentNum;
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

let oldValue;
let oldSymbol;
let newSolved = false;
function operate() {
  let currentValue = this.value;
  let solved = makeEquation(previousNum);
  
  let newValue = inputDiv.textContent;
  let index = newValue.indexOf(this.value);
  newValue = newValue.substring(0, index);
  

  if (currentValue < 10 && newValue == solved) {
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
    const textNode = document.createTextNode(`${currentValue}`);
    inputDiv.appendChild(textNode);
  }


  if (symbols.some(symbol => symbol == currentValue)) {
    
    if (newSolved) {
      symbol = this.value
      console.log(oldValue);
      console.log(newValue);
      currentValue = parseInt(currentValue);
      newSolved = newGuy[symbol](oldValue, oldSymbol);
      console.log(newSolved);
      
      inputDiv.textContent = newSolved;
      oldValue = newSolved;
    } else if (!isNaN(solved)) {
      
      inputDiv.textContent = solved;
      oldValue = solved;
      newSolved = true;
      oldSymbol = this.value;
    } 
  } 
  
}

const newGuy = {
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
      return newGuy[numCheck](firstNum, secondNum);
    };
  }
}
  // array.forEach((char) => {
  //   console.log(char);
  // })