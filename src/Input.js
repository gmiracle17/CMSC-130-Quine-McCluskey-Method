import { useState } from "react"

function InputSection() {
    const[minterms, setMinterms] = useState(""); 
    const[variables, setVariables] = useState(""); 

    return (
        <div className="input-container">
            <h1>Quine-McCluskey Method Solver</h1>
            <div className="sub-container">
                <MintermsInput value={minterms} retrieveMinterms={setMinterms}/>
                <VariablesInput value={variables} retrieveVariables={setVariables}/>
                <SolveButton HandleInputs={() => HandleInputs(minterms, variables)}/>
            </div>

        </div>
    ); 
}

function MintermsInput({value, retrieveMinterms}) {

    function handleChange(event) {
        retrieveMinterms(event.target.value); 
    }

    return(
        <div>
            <label>Minterms</label>
            <input type="text" value={value} onChange={handleChange}></input>
            <p>{value}</p>
        </div>
    )

}

function VariablesInput({value, retrieveVariables}) {

    function handleChange(event) {
        retrieveVariables(event.target.value); 
    }

    return (
        <div>
            <label>Variables</label>
            <input type="text" value={value} onChange={handleChange}></input>
        </div>
    )
}

function SolveButton({HandleInputs}) {

    /* 
    Have an array of text
    If the array is not empty, add a try again at the end of the error statement and invalid input at the start of the error
    Connect them
    [mintermsFormatCorrect, noMintermDuplicates, noNonDigit, variablesFormatCorrect, noNonLetter, noVariableDuplicates, sufficientVariables]
    */

    function onButtonClick() {
        let handleInputsArray = HandleInputs(); 
        let errorText = ''; 
        for(let index = 0; index < handleInputsArray.length; index++) {
            if (handleInputsArray[index] !== '') {
                errorText = errorText + handleInputsArray[index] + '. '; 
            }
        }

        if (errorText === '') {
            console.log("Proceed to next step"); 
        } 
        else {
            errorText = errorText + "Please try again."
        }

    }

    return(
        <div>
            <p>{errorText}</p>
            <button className="solve-button" onClick={onButtonClick}>Solve</button>
        </div>
        
    ); 
}

function HandleInputs(minterms, variables) {
    /* 
    minterms
    1. remove any leading or trailing white spaces
    2. split via , and store them in an array
    3. Check for any duplicates
    4. Check if it is a digit
    5. Check if correct format of , 
    */

    let mintermsFormatMessage = '';
    let mintermDuplicatesMesage = ''; 
    let nonDigitMessage = '';
    let maxNumber; 

    minterms = minterms.trim(); 
    let mintermsArray = minterms.split(','); 

    for (let index = 0; index < mintermsArray.length; index++) {
        let element = parseFloat(mintermsArray[index])
        if(!Number.isInteger(element) || element < 0) {
            nonDigitMessage = 'Minterms should only be positive integers'; 
        } 
        else {
            mintermsArray[index] = parseFloat(mintermsArray[index]); 
        }
    }

    const mintermsDuplicates = mintermsArray.filter((item, index) => mintermsArray.indexOf(item) !== index)

    if (mintermsDuplicates.length !== 0) {
        mintermDuplicatesMesage = 'Minterms should have no duplicates'; 
    }

    if (noNonDigit === true) {
        mintermsArray.sort(); 
        maxNumber = mintermsArray.at(-1); 
    }

    /* 
    variables 
    1. remove any leading or trailing white spaces
    2. transform into an array
    3. Check for any duplicates. 
    4. Check if it has sufficient variables depending on the minterms. 
    */

    variables = variables.trim(); 
    let variablesArray = []; 
    let variablesFormatMessage = ''; 
    let nonLetterMessage = '';
    let variableDuplicatesMessage = ''; 
    let sufficientVariablesMessage = '';

    for (let index = 0; index < variables.length; index++) {
        let char = variables.charAt(index); 

        if (char === " ") {
            variablesFormatMessage = 'Incorrect variables format. Ensure there are no spaces';
        } else {
            variablesArray.push(char);
            if (!/[a-zA-Z]/.test(char)) {
                nonLetterMessage = 'Variables should only be letters of the English Alphabet';
            }
        }
    }


    const variablesDuplicates = variablesArray.filter((item, index) => variablesArray.indexOf(item) !== index)

    if (variablesDuplicates.length !== 0) {
        variableDuplicatesMessage = 'Variables should have no duplicates'; 
    }

    if (noVariableDuplicates === true) {
        if (Math.pow(2, variablesArray.length) - 1 < maxNumber) {
            let quantityVariables = variablesArray.length; 
            while(Math.pow(2, quantityVariables) - 1 < maxNumber) {
                quantityVariables++; 
            }
            sufficientVariablesMessage = 'Number of variables should be at least ' + quantityVariables; 
        }
    }

    return [mintermsFormatMessage, mintermDuplicatesMesage, nonDigitMessage, variablesFormatMessage, nonLetterMessage, variableDuplicatesMessage, sufficientVariablesMessage]; 

}


export default InputSection; 

/* 
Invalid inputs that must be handled
- duplicate minterms
- minterms not a number
- duplicate variables 
- not separated with commas in minterms
- Insufficient variables 
- Variables separated by space

- Next thing to do: Decide if you want to break the input section into separate components or not
- Pwedeng iisang component nalang yung MintermsInput and VariablesInput

*/