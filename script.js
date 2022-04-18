const inputDiv = document.querySelector('#input-div');
const oldInput = document.querySelector('#old-inputs');
const buttons = document.querySelectorAll('button');
let previousValue = '';
const symbols = ['√', '^', '÷', '×', '−', '+', '=', ')', '('];
const displaySymbols = ['√', '^', '÷', '×', '−', '+', ')', '('];

buttons.forEach(button => button.addEventListener('click', displayNumbers));
buttons.forEach(button => button.addEventListener('click', operate));

function displayNumbers() {
  let currentValue = this.value;
  const textNode = document.createTextNode(`${currentValue}`);
  const textP = document.createElement('span');
  textP.appendChild(textNode);

  if (currentValue == '=') {
    if (currentValue == previousValue) return;
    const textNode = document.createTextNode(`${currentValue}` + ' ' + `${inputDiv.textContent}` + ' ');
    oldInput.insertBefore(textNode, oldInput.firstChild);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  } else if (inputDiv.textContent.includes(')') || inputDiv.textContent.includes('(')) {
    if (currentValue < 10 || displaySymbols.some(symbol => symbol == currentValue)) {
      inputDiv.appendChild(textP);
    }
  } else if (currentValue < 10 || currentValue == ')' || currentValue == '(') {
    inputDiv.appendChild(textP);
  } else if (symbols.some(symbol => symbol == currentValue)) {
    if (symbols.includes(previousValue)) return;
    const textNode = document.createTextNode(`${currentValue}` + ' ' + `${inputDiv.textContent}` + ' ');
    oldInput.insertBefore(textNode, oldInput.firstChild);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  }
  previousValue = this.value;
}

function operate() {

}