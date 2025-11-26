// ---- UI selectors ----
const previousDisplay = document.getElementById('previousDisplay');
const currentDisplay = document.getElementById('currentDisplay');

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');

const equalButton = document.getElementById('equal');
const clearButtons = document.querySelectorAll('[data-clear]');
const deleteButtons = document.querySelectorAll('[data-delete]');

const percentButtons = document.querySelectorAll('[data-operator="percent"]');
const negateButton = document.getElementById('plusminus');

const historyTab = document.getElementById('history-tab');
const memoryTab = document.getElementById('memory-tab');

const historyList = document.getElementById('history-list');
const memoryList = document.getElementById('memory-list');

const mPlusBtn = document.getElementById('m-plus');
const mMinusBtn = document.getElementById('m-minus');
const mrBtn = document.getElementById('mr');
const mcBtn = document.getElementById('mc');

// ---- state ----
let currentOperand = '';
let previousOperand = '';
let operator = null;
let lastButtonWasOperator = false; // useful to manage active behavior

let history = [];   // stores strings like "3 + 4 = 7"
let memory = [];    // stores numeric values for memory

// ---- helpers ----
function formatNumberForDisplay(str) {
  // keep as simple: if empty -> 0
  if (str === '' || str === undefined || str === null) return '0';
  return str.toString();
}

// ensure History stays hidden if Memory tab active
function ensureHistoryHiddenIfMemoryActive() {
  if (memoryTab.classList.contains('tab-active')) {
    historyList.classList.add('hidden');
  }
}

// ---- display updates ----
function updateDisplay() {
  currentDisplay.textContent = formatNumberForDisplay(currentOperand || '0');
  previousDisplay.textContent = previousOperand ? `${previousOperand} ${operatorSymbol(operator) || ''}` : '';
}

// update history UI but DO NOT unhide it if memory tab is active
function updateHistoryUI() {
  if (history.length === 0) {
    historyList.innerHTML = '<li class="empty">There\'s no history yet</li>';
  } else {
    historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
  }
  // critical: if memory tab active, keep history hidden
  ensureHistoryHiddenIfMemoryActive();
}

// update memory UI
function updateMemoryUI() {
  if (memory.length === 0) {
    memoryList.innerHTML = '<li class="empty">There\'s no memory yet</li>';
  } else {
    // show last-first order (most recent first)
    memoryList.innerHTML = memory.slice().reverse().map(item => `<li>${item}</li>`).join('');
  }
}

// operator -> symbol helper
function operatorSymbol(op) {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '−';
    case 'multiply': return '×';
    case 'divide': return '÷';
    case 'percent': return '%';
    default: return '';
  }
}

// ---- memory buttons state ----
function updateMemoryButtonsState() {
  if (memory.length === 0) {
    mrBtn.classList.add('disabled');
    mcBtn.classList.add('disabled');
  } else {
    mrBtn.classList.remove('disabled');
    mcBtn.classList.remove('disabled');
  }
}

// ---- core actions ----
function appendNumber(num) {
  // prevent multiple leading zeros like "00"
  if (num === '0' && currentOperand === '0') return;
  // prevent multiple dots
  if (num === '.' && currentOperand.includes('.')) return;

  // first number typed after operator: clear highlight
  setActiveOperator(null);
  lastButtonWasOperator = false;

  currentOperand = (currentOperand === '0' && num !== '.') ? num : currentOperand + num;
  updateDisplay();
}

function chooseOperator(op, btnElement = null) {
  if (currentOperand === '') {
    // allow change of operator if user presses operators consecutively
    operator = op;
    setActiveOperator(btnElement);
    return;
  }

  if (previousOperand !== '') {
    compute(); // chain computation
  }

  operator = op;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();

  // set active operator highlight
  setActiveOperator(btnElement);

  lastButtonWasOperator = true;
}

function compute() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr) || !operator) {
    // nothing to compute
    return;
  }

  let result;
  switch (operator) {
    case 'add': result = prev + curr; break;
    case 'subtract': result = prev - curr; break;
    case 'multiply': result = prev * curr; break;
    case 'divide': result = curr === 0 ? NaN : prev / curr; break;
    case 'percent': result = prev * (curr / 100); break;
    default: return;
  }

  // record history (but DO NOT toggle visibility)
  const record = `${prev} ${operatorSymbol(operator)} ${curr} = ${result}`;
  history.push(record);
  updateHistoryUI();

  // set result
  currentOperand = String(result);
  previousOperand = '';
  operator = null;
  // remove operator highlight as computation finished
  setActiveOperator(null);
  updateDisplay();
  // IMPORTANT: if memory tab active we must keep history hidden
  ensureHistoryHiddenIfMemoryActive();
}

// clear (AC) - applied by any clear-btn
function clearAll() {
  currentOperand = '';
  previousOperand = '';
  operator = null;
  setActiveOperator(null);
  updateDisplay();
}

// delete (DEL) - remove last char of current
function deleteLast() {
  if (currentOperand.length <= 1) currentOperand = '';
  else currentOperand = currentOperand.slice(0, -1);
  updateDisplay();
}

// percent (optional - handled as operator)
function applyPercent() {
  if (currentOperand === '') return;
  currentOperand = String(parseFloat(currentOperand) / 100);
  updateDisplay();
}

// negate
function negate() {
  if (currentOperand === '') return;
  if (currentOperand.startsWith('-')) currentOperand = currentOperand.slice(1);
  else currentOperand = '-' + currentOperand;
  updateDisplay();
}

// ---- operator highlight helper ----
function setActiveOperator(buttonEl) {
  operatorButtons.forEach(b => b.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
}

// ---- memory functions ----
function memoryAdd() {
  if (currentOperand === '') return;
  memory.push(Number(currentOperand));
  updateMemoryUI();
  updateMemoryButtonsState();
}
function memorySubtract() {
  if (currentOperand === '') return;
  memory.push(-Number(currentOperand));
  updateMemoryUI();
  updateMemoryButtonsState();
}
function memoryRecall() {
  if (memory.length === 0) return;
  // recall most recent
  currentOperand = String(memory[memory.length - 1]);
  updateDisplay();
}
function memoryClear() {
  memory = [];
  updateMemoryUI();
  updateMemoryButtonsState();
}

// ---- tabs behavior ----
historyTab.addEventListener('click', () => {
  historyTab.classList.add('tab-active');
  memoryTab.classList.remove('tab-active');
  historyList.classList.remove('hidden');
  memoryList.classList.add('hidden');
});

memoryTab.addEventListener('click', () => {
  memoryTab.classList.add('tab-active');
  historyTab.classList.remove('tab-active');
  memoryList.classList.remove('hidden');
  historyList.classList.add('hidden');
});

// ---- wire up events ----
numberButtons.forEach(btn => {
  btn.addEventListener('click', () => appendNumber(btn.dataset.number));
});

operatorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    chooseOperator(btn.dataset.operator, btn);
  });
});

// clear and delete (multiple elements supported)
clearButtons.forEach(btn => btn.addEventListener('click', clearAll));
deleteButtons.forEach(btn => btn.addEventListener('click', deleteLast));

equalButton.addEventListener('click', () => {
  compute();
});

// percent and negate wiring
document.querySelectorAll('[data-operator="percent"]').forEach(b => b.addEventListener('click', () => {
  // treat percent as operator requiring previous operand
  if (previousOperand === '') return;
  // set operator to percent and compute
  operator = 'percent';
  compute();
}));

if (negateButton) negateButton.addEventListener('click', negate);

// memory buttons
mPlusBtn.addEventListener('click', memoryAdd);
mMinusBtn.addEventListener('click', memorySubtract);
mrBtn.addEventListener('click', memoryRecall);
mcBtn.addEventListener('click', memoryClear);

// initial UI setup
updateDisplay();
updateHistoryUI();
updateMemoryUI();
updateMemoryButtonsState();
ensureHistoryHiddenIfMemoryActive();
