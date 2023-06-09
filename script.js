class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        //removes the very last cahracter of the string by keeping the first 
        //and second to last index
        this.currentOperand = this.currentOperand.toString().slice(0,-1)
    }

    appendNumber(number)  {
        //prevents inputting more than one '.'
        if (number === '.' && this.currentOperand.includes('.')) return

        //convert numbers to string
        //we want to append it, not perform the add operation
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== ''){
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        //create a variable for the final result
        let computation 

        //convert the strings to floats
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)

        //if there are no numbers, return nothing
        //this prevents executing the operation when there is nothing
        if (isNaN(prev) || isNaN(current)) return

        //actual calculation
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case 'x':
                computation = prev * current
                break
            case '÷':
                computation = prev / current
                break
            default:
                return
        }

        //update the variables and clear the operations after performing actual calculation
        this.currentOperand = computation
        this.operation  = undefined
        this.previousOperand = ''
    }

    updateDisplay() {
        //displays current text element as the currentOperand
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)

        //displays both the text element and the operand as the innerText
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }
        else{
            this.previousOperandTextElement.innerText = ''
        }
    }

    //allows the addition of commas
    getDisplayNumber(number){
        //problem occurs when trying to inlcude '.' because it is not considered a number
        //even though we wrote it as a number

        //get every part of the string that can be inputted
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0]) //the numbers before '.' are the integer digits
        const decimalDigits = stringNumber.split('.')[1] //the numbers after '.' are the decimals

        let integerDisplay
        //if the user inputs nothing on the screen or a '.'
        if (isNaN(integerDigits)){
            integerDisplay = ''
        }
        //the maximum fraction digits ensures there are no more '.' after the first one
        else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits:0})
        }

        //if there are decimal digits
        if (decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`
        }
        else{
            return integerDisplay
        }
    }
}

//creates constants correlated to the buttons from HTML
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

//instantiate the calculator object
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

//There are more than one number button so we iterate for each
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
        })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
        })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})