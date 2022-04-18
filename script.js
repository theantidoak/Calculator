const inputDiv = document.querySelector('#input-div');
const oldInput = document.querySelector('#old-inputs');
const buttons = document.querySelectorAll('button');
let previousValue = '';
const symbols = ['√', '^', '÷', '×', '−', '+', '(', ')', '.'];

buttons.forEach(button => button.addEventListener('click', displayNumbers));
buttons.forEach(button => button.addEventListener('click', operate));

function displayNumbers() {
  let currentValue = this.value;
  const textNode = document.createTextNode(`${currentValue}`);

  // if (previousValue == '√') {
  //   if (currentValue < 10) return;
  //   else {
  //     const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
  //     oldInput.append(textNode);
  //   }
  // }

  if (currentValue == '=') {
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
  } else if (symbols.some(symbol => symbol == currentValue)) {
    if (symbols.includes(previousValue)) return;
    const textNode = document.createTextNode(`${inputDiv.textContent}` + ' ' + `${currentValue}` + ' ');
    oldInput.append(textNode);
    while (inputDiv.firstChild) {
      inputDiv.removeChild(inputDiv.lastChild);
    }
  }
  previousValue = this.value;
}

function operate() {

}