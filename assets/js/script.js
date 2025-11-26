function symbol(op) {
  switch (op) {
    case "add": return "+";
    case "subtract": return "-";
    case "multiply": return "×";
    case "divide": return "÷";
  }
}

//theme

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


//functionality

const display = document.querySelector('.show-part');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');

const equalButton = document.querySelectorAll('[data-equal]');
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

    // ذخیره در هیستوری
  const record = `${prev} ${symbol(operator)} ${curr} = ${result}`;
  history.push(record);
  updateHistoryUI();

// ensure we don't unhide history when memory tab active
if (memoryTab.classList.contains('tab-active')) {
  historyList.classList.add('hidden');
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


//sign toggle

const signToggleButtons = document.querySelectorAll('[data-toggle="sign"]');

signToggleButtons.forEach(btn => {
  btn.addEventListener("click", toggleSign);
});

function toggleSign() {
  if (currentOperand === "" || currentOperand === null) return;

  // اگر عدد معتبر است، علامتش را برعکس کن
  currentOperand = String(parseFloat(currentOperand) * -1);

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


//memory & history

let history = [];
let memory = [];


const mpBtn = document.getElementById("m-plus");
const mmBtn = document.getElementById("m-minus");
const mrBtn = document.getElementById("m-recall");
const mcBtn = document.getElementById("m-clear");

mpBtn.addEventListener("click", memoryAdd);
mmBtn.addEventListener("click", memorySubtract);
mrBtn.addEventListener("click", memoryRecall);
mcBtn.addEventListener("click", memoryClear);

function updateHistoryUI() {
  // use the UL directly (historyList is from getElementById)
  if (history.length === 0) {
    historyList.innerHTML = '<li class="no-history">There\'s no history yet</li>';
  } else {
    historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
  }

  // If Memory tab is active, keep history hidden
  if (memoryTab.classList.contains('tab-active')) {
    historyList.classList.add('hidden');
  }
}


const historyTab = document.getElementById("history-tab");
const memoryTab = document.getElementById("memory-tab");
const historyList = document.getElementById("history-list");
const memoryList = document.getElementById("memory-list");

function updateMemoryUI() {
  if (memory.length === 0) {
    memoryList.innerHTML = '<li class="no-memory">There\'s no memory yet</li>';
  } else {
    // نمایش از آخر به اول (آخرین مقدار اول)
    memoryList.innerHTML = memory.slice().reverse().map(item => `<li>${item}</li>`).join('');
  }
}


function memoryAdd() {
  if (currentOperand !== "") {
    memory.push(Number(currentOperand));
    updateMemoryUI();
    updateMemoryButtons();

  }
}

function memorySubtract() {
  if (currentOperand !== "") {
    memory.push(-Number(currentOperand));
    updateMemoryUI();
    updateMemoryButtons();
  }
}

function memoryRecall() {
  if (memory.length > 0) {
    currentOperand = memory[memory.length - 1].toString();
    updateDisplay();
  }
}

function memoryClear() {
  memory = [];
  updateMemoryUI();
  updateMemoryButtons();
}


// تغییر تب به History
historyTab.addEventListener("click", () => {
    historyTab.classList.add("tab-active");
    memoryTab.classList.remove("tab-active");

    historyList.classList.remove("hidden");
    memoryList.classList.add("hidden");
});

// تغییر تب به Memory
memoryTab.addEventListener("click", () => {
    memoryTab.classList.add("tab-active");
    historyTab.classList.remove("tab-active");

    memoryList.classList.remove("hidden");
    historyList.classList.add("hidden");
});

function updateMemoryButtons() {
  if (memory.length === 0) {
    mcBtn.classList.add("disabled");
    mrBtn.classList.add("disabled");
  } else {
    mcBtn.classList.remove("disabled");
    mrBtn.classList.remove("disabled");
  }
}

// یک‌بار هنگام شروع اجرا شود
updateMemoryButtons();




