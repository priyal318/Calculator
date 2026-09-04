const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

const OP_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function updateDisplay() {
  resultEl.textContent = current;
  if (operator && previous !== null) {
    expressionEl.textContent = `${previous} ${OP_SYMBOLS[operator]}`;
  } else {
    expressionEl.textContent = "";
  }
}

function inputDigit(digit) {
  if (justEvaluated) {
    current = digit;
    justEvaluated = false;
    return;
  }
  if (current === "0") {
    current = digit;
  } else {
    if (current.replace("-", "").length >= 12) return;
    current += digit;
  }
}

function inputDecimal() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function negate() {
  if (current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
}

function percent() {
  current = String(parseFloat(current) / 100);
}

function compute(a, b, op) {
  switch (op) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function formatResult(value) {
  if (Number.isNaN(value)) return "Error";
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

function chooseOperator(nextOp) {
  if (operator && previous !== null && !justEvaluated) {
    const result = compute(parseFloat(previous), parseFloat(current), operator);
    previous = formatResult(result);
    current = previous;
  } else {
    previous = current;
  }
  operator = nextOp;
  justEvaluated = false;
  current = "0";
}

function equals() {
  if (operator === null || previous === null) return;
  const result = compute(parseFloat(previous), parseFloat(current), operator);
  current = formatResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

function handleAction(action) {
  switch (action) {
    case "clear":
      clearAll();
      break;
    case "negate":
      negate();
      break;
    case "percent":
      percent();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "equals":
      equals();
      break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      chooseOperator(action);
      break;
  }
  updateDisplay();
}

document.querySelectorAll(".key").forEach((btn) => {
  btn.addEventListener("click", () => {
    const digit = btn.dataset.num;
    const action = btn.dataset.action;
    if (digit !== undefined) {
      if (operator && justEvaluated) {
        previous = null;
        operator = null;
      }
      inputDigit(digit);
      justEvaluated = false;
      updateDisplay();
    } else if (action) {
      handleAction(action);
    }
  });
});

const KEY_MAP = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  Enter: "equals",
  "=": "equals",
  Escape: "clear",
  "%": "percent",
};

window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    inputDigit(e.key);
    updateDisplay();
    return;
  }
  if (e.key === ".") {
    inputDecimal();
    updateDisplay();
    return;
  }
  const action = KEY_MAP[e.key];
  if (action) {
    e.preventDefault();
    handleAction(action);
  }
});

updateDisplay();