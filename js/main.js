let runningTotal = 0
let buffer = '0'
let previousOperator = null
const screen = document.querySelector('.calculator__screen')
screen.value = buffer

function buttonClick(value) {
	if (isNaN(parseInt(value))) {
		handleSymbol(value)
	} else {
		handleNumber(value)
	}

	rerender()
}

function handleNumber(value) {
	if (buffer === '0') {
		buffer = value
	} else {
		buffer += value
	}
}

function handleMath(value) {
	if (buffer === '0') {
		// do nothing
		return
	}

	const intBuffer = parseInt(buffer)
	if (runningTotal === 0) {
		runningTotal = intBuffer
	} else {
		flushOperation(intBuffer)
	}

	previousOperator = value

	// buffer = '0'
}

function flushOperation(intBuffer) {
	if (previousOperator === '+') {
		runningTotal += intBuffer
	} else if (previousOperator === '−') {
		runningTotal -= intBuffer
	} else if (previousOperator === '×') {
		runningTotal *= intBuffer
	} else {
		runningTotal /= intBuffer
	}
}

function handleSymbol(value) {
	switch (value) {
		case 'C':
			buffer = '0'
			runningTotal = 0
			break
		case '=':
			if (previousOperator === null) {
				// need two numbers to do math
				return
			}
			flushOperation(parseInt(buffer))
			previousOperator = null
			buffer = +runningTotal
			runningTotal = 0
			break
		case '➔':
			if (buffer.length === 1) {
				buffer = '0'
			} else {
				const bufferString = buffer.toString()
				buffer = bufferString.substring(0, bufferString.length - 1)
			}
			break
		case '+':
		case '−':
		case '×':
		case '÷':
			handleMath(value)
			break
	}
}

function rerender() {
	screen.value = buffer
}

function init() {
	document
		.querySelector('.calculator__keys')
		.addEventListener('click', function (event) {
			buttonClick(event.target.innerText)
		})
}

init()
