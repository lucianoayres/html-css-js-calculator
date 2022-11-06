const MAX_BUFFER_LENGTH = 9
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
	if (buffer.length > MAX_BUFFER_LENGTH) return

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
	if (previousOperator === 'add') {
		runningTotal += intBuffer
	} else if (previousOperator === 'subtract') {
		runningTotal -= intBuffer
	} else if (previousOperator === 'multiply') {
		runningTotal *= intBuffer
	} else {
		runningTotal /= intBuffer
	}
}

function handleSymbol(symbol) {
	switch (symbol) {
		case 'reset':
			buffer = '0'
			runningTotal = 0

			resetBufferValues()
			break
		case 'equals':
			updateBufferValue(parseFloat(buffer))

			if (previousOperator === null) {
				// need two numbers to do math
				return
			}

			flushOperation(parseFloat(buffer))
			const runningTotalString = runningTotal.toString()
			toggleScreenTextSize(runningTotalString)
			buffer = runningTotalString

			previousOperator = null
			runningTotal = 0
			resetBufferValues()
			break
		case 'backspace':
			const bufferString = buffer.toString()

			if (bufferString.length === 1) {
				buffer = '0'
			} else {
				buffer = bufferString.substring(0, bufferString.length - 1)
			}

			toggleScreenTextSize(bufferString)

			break
		case 'add':
		case 'subtract':
		case 'multiply':
		case 'divide':
			handleMath(symbol)
			break
	}
}

function toggleScreenTextSize(totalString) {
	if (totalString.length > MAX_BUFFER_LENGTH) {
		screen.classList.add('screen--small-text')
	} else {
		screen.classList.remove('screen--small-text')
	}
}

function rerender() {
	screen.value = buffer
}

function init() {
	document
		.querySelector('.calculator__keys')
		.addEventListener('click', function (event) {
			buttonClick(event.target.value)
		})
}

init()
