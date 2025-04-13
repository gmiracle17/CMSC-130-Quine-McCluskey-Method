import { useState } from "react"
import './Input.css';

function InputSection({setActiveTab, setMintermsArray, setVariablesArray}) {
    const[minterms, setMinterms] = useState(""); 
    const[variables, setVariables] = useState(""); 

    return (
        <div className="input-container">
            <h1>Input Minterms and Variables</h1>
            <div className="sub-container">
                <InputComponent label="Minterms" value={minterms} retrieveInput={setMinterms} /> 
                <InputComponent label="Variables" value={variables} retrieveInput={setVariables} />
                <SolveButton minterms={minterms} variables = {variables} HandleInputs={() => HandleInputs(minterms, variables)} setMintermsArray={setMintermsArray} setVariablesArray={setVariablesArray} setActiveTab={setActiveTab}/>
            </div>

        </div>
        
    ); 
}

function InputComponent({label, value, retrieveInput}) {
    function handleChange(event) {
        retrieveInput(event.target.value); 
    }

    return(
        <div>
            <label>{label}</label>
            <input type="text" value={value} onChange={handleChange}></input>
            <p>{value}</p>
        </div>
    )

}

function SolveButton({minterms, variables, HandleInputs, setMintermsArray, setVariablesArray, setActiveTab}) {

    /* 
    Have an array of text
    If the array is not empty, add a try again at the end of the error statement and invalid input at the start of the error
    Connect them
    [mintermsFormatCorrect, noMintermDuplicates, noNonDigit, variablesFormatCorrect, noNonLetter, noVariableDuplicates, sufficientVariables]
    */
   const[errorText, setErrorText] = useState(''); 

   function setArrays() {
        let variablesArray = []; 
        for(let index = 0; index < variables.length; index++) {
            variablesArray.push(variables.charAt(index));
        }
        setVariablesArray(variablesArray); 
        let mintermsArray = minterms.split(','); 
        for(let index = 0; index < mintermsArray.length; index++) {
            mintermsArray[index] = parseFloat(mintermsArray[index]);
        }

        setMintermsArray(mintermsArray); 
        
   }

    function onButtonClick() {
        let handleInputsArray = HandleInputs(); 
        let message = ''; 
        for(let index = 0; index < handleInputsArray.length; index++) {
            if (handleInputsArray[index] !== '') {
                message = message + handleInputsArray[index] + '. '; 
            }
        }

        if (message === '') {
            setArrays(); 
            setActiveTab('pairwise'); 
            console.log("Proceed to next step"); 
        } 
        else {
            message = message + "Please try again."
        }

        setErrorText(message); 

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
            nonDigitMessage = 'Incorrect minterms input format. Minterms inputted should only be positive integers separated with commas with no space'; 
        } 
        else {
            mintermsArray[index] = parseFloat(mintermsArray[index]); 
        }
    }

    const mintermsDuplicates = mintermsArray.filter((item, index) => mintermsArray.indexOf(item) !== index)

    if (mintermsDuplicates.length !== 0 && nonDigitMessage === '') {
        mintermDuplicatesMesage = 'Minterms should have no duplicates'; 
    }

    if (mintermsDuplicates.length === 0) {
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

    if (variablesDuplicates.length === 0) {
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
*/