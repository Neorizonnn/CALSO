const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let lastNumber = null;
let lastOperator = null;
let memory = 0;




// DISPLAY


function updateDisplay() {
    display.textContent = formatNumber(currentInput);
}



// NUMBER FORMATTING


function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    // Scientific notation for very large/small numbers
    if (Math.abs(number) >= 1e14) {
        return number.toExponential(6);
    }


    return value;
}



// NUMBER INPUT


function inputNumber(number) {

    if (waitingForSecondNumber) {
        currentInput = number;
        waitingForSecondNumber = false;
    }
    else if (currentInput === "0") {
        currentInput = number;
    }
    else {
        currentInput += number;
    }

    limitInput();
    updateDisplay();
}



// DECIMAL


function inputDecimal() {

    if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
        updateDisplay();
        return;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}



// LIMIT INPUT TO 10 DIGITS


function limitInput() {

    const digits = currentInput
        .replace("-", "")
        .replace(".", "");

    if (digits.length > 14) {
        currentInput = currentInput.slice(0, -1);
    }
}



// OPERATORS


function chooseOperator(nextOperator) {

    const inputValue = Number(currentInput);

    // User changes operator before entering second number
    if (operator && waitingForSecondNumber) {
        operator = nextOperator;
        return;
    }

    // First number
    if (firstNumber === null) {
        firstNumber = inputValue;
    }

    // Calculate a previous operation
    else if (operator) {

        const result = calculate(
            firstNumber,
            inputValue,
            operator
        );

        currentInput = String(result);
        firstNumber = result;

        updateDisplay();
    }

    operator = nextOperator;
    waitingForSecondNumber = true;

    
    lastOperator = null;
    lastNumber = null;
}



// CALCULATION


function calculate(first, second, operator) {

    switch (operator) {

        case "+":
            return first + second;

        case "−":
            return first - second;

        case "X":
            return first * second;

        case "÷":
            if (second === 0) {
                return NaN;
            }
            return first / second;

        default:
            return second;
    }
}



// EQUALS

function equals() {

    // Normal calculation
    if (operator !== null && firstNumber !== null) {

        const secondNumber = Number(currentInput);

        const result = calculate(
            firstNumber,
            secondNumber,
            operator
        );

        currentInput = String(result);

        // Remember for repeated "="
        lastNumber = secondNumber;
        lastOperator = operator;

    
        firstNumber = result;

        // Current operation is finished
        operator = null;
        waitingForSecondNumber = false;

        updateDisplay();

        return;
    }

    // Repeated "="
    if (lastOperator !== null && lastNumber !== null) {

        const currentNumber = Number(currentInput);

        const result = calculate(
            currentNumber,
            lastNumber,
            lastOperator
        );

        currentInput = String(result);
        firstNumber = result;

        updateDisplay();
    }
}


// CLEAR


function clearAll() {

    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    updateDisplay();
}


// CLEAR ENTRY


function clearEntry() {

    currentInput = "0";

    updateDisplay();
}



// PLUS / MINUS


function toggleSign() {

    if (currentInput === "0") {
        return;
    }

    if (currentInput.startsWith("-")) {
        currentInput = currentInput.slice(1);
    }
    else {
        currentInput = "-" + currentInput;
    }

    updateDisplay();
}



// PERCENTAGE


function percentage() {

    const value = Number(currentInput);

    currentInput = String(value / 100);

    updateDisplay();
}

// MC
function memoryClear() {
    memory = 0;
}
// MR
function memoryRecall() {
    currentInput = String(memory);
    updateDisplay();
}
// M+
function memoryAdd() {
    memory += Number(currentInput);
}
// M-
function memorySubtract() {
    memory -= Number(currentInput);
}

// BUTTON EVENTS


buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;

        if (!isNaN(value)) {
            inputNumber(value);
        }

        else if (value === ".") {
            inputDecimal();
        }

        else if (value === "+" || value === "−" || value === "X" || value === "÷") {
            chooseOperator(value);
        }

        else if (value === "=") {
            equals();
        }

        else if (value === "C") {
            clearAll();
        }

        else if (value === "CE") {
            clearEntry();
        }

        else if (value === "+/-") {
            toggleSign();
        }

        else if (value === "%") {
            percentage();
        }
        else if (value === "MC") {
            memoryClear();
        }

        else if (value === "MR") {
            memoryRecall();
        }

        else if (value === "M+") {
            memoryAdd();
        }

        else if (value === "M-") {
            memorySubtract();
        }

    });

});