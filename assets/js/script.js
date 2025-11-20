
const themes = ["theme", "theme1", "theme2"];
let currentTheme = 0;

const root = document.documentElement;
const toggleButton = document.querySelector(".menu");

toggleButton.addEventListener("click", () => {
  // حذف تمام تم‌ها از root
  themes.forEach(theme => root.classList.remove(theme));

  // انتخاب تم بعدی
  currentTheme = (currentTheme + 1) % themes.length;

  // اضافه کردن تم جدید
  root.classList.add(themes[currentTheme]);
});

const display = document.querySelector('.show-part');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');

const equalButton = document.querySelectorAll("[data-equal]");
const clearButton = document.querySelectorAll('[data-clear]');
const deleteButton = document.querySelectorAll('[data-delete]');

let currentOperand = "";
let previousOperand = "";
let operator = null;

function setActiveOperator(button) {
  // حذف active از همه عملگرها
  operatorButtons.forEach(btn => btn.classList.remove("active"));

  // اضافه کردن active به دکمه انتخاب شده
  if (button) {
    button.classList.add("active");
  }
}

function appendNumber(num) {
  if (num === '.' && currentOperand.includes('.'))return;
  setActiveOperator(null);
  currentOperand += num;
  updateDisplay();
}

function chooseOperator(op) {
  if (currentOperand === "") return;
  if (previousOperand !== "") {
    compute();
  }
  operator = op;
  previousOperand = currentOperand;
  currentOperand = "";
}

function compute() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return;

  let result;

  switch (operator) {
    case 'add':
      result = prev + curr;
      break;
    case 'subtract':
      result = prev - curr;
      break;
    case 'multiply':
      result = prev * curr;
      break;
    case 'divide':
      result = prev / curr;
      break;
    default:
      return;
  }

  currentOperand = result.toString();
  operator = null;
  previousOperand = "";
  setActiveOperator(null);
}

equalButton.forEach(btn =>{
  btn.addEventListener('click', () =>{
  compute();
  updateDisplay();
});
});
deleteButton.forEach(btn =>{
  btn.addEventListener('click', deleteNumber);
});
clearButton.forEach(btn =>{
  btn.addEventListener('click', clear);
});

function clear() {
  currentOperand = "";
  previousOperand = "";
  operator = null;
  setActiveOperator(null);
  updateDisplay();
}

function deleteNumber() {
  currentOperand = currentOperand.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentOperand || "0";
}

numberButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    appendNumber(btn.textContent);
  });
});

operatorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.operator;
    chooseOperator(op);
    setActiveOperator(btn);
  });
});

