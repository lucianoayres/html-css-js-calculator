let runningTotal = 0
let buffer = '0'
let previousOperator = null
const screen = document.querySelector('.calculator__screen')

let bufferValues = {
	primary: null,
	secondary: null,
}

screen.value = buffer

function buttonClick(value) {
	if (isNaN(parseFloat(value))) {
		handleSymbol(value)
	} else {
		handleNumber(value)
	}

	rerender()
}

function handleNumber(value) {
	if (buffer === '0' || buffer === bufferValues.primary) {
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

	const intBuffer = parseFloat(buffer)
	if (runningTotal === 0) {
		runningTotal = intBuffer
	} else {
		flushOperation(intBuffer)
	}

	updateBufferValue(intBuffer)

	previousOperator = value

	if (bufferValues.primary) {
		buffer = parseFloat(bufferValues.primary)
	}
}

function updateBufferValue(bufferNumber) {
	if (previousOperator) {
		bufferValues.secondary = bufferNumber
	} else {
		bufferValues.primary = bufferNumber
	}
}

function resetBufferValues() {
	bufferValues = {
		primary: null,
		secondary: null,
	}
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

function handleSymbol(symbol) {
	switch (symbol) {
		case 'C':
			buffer = '0'
			runningTotal = 0

			resetBufferValues()
			break
		case '=':
			updateBufferValue(parseFloat(buffer))

			if (previousOperator === null) {
				// need two numbers to do math
				return
			}
			flushOperation(parseFloat(buffer))
			previousOperator = null
			buffer = +runningTotal
			runningTotal = 0

			resetBufferValues()
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
			handleMath(symbol)
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
