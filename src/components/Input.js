import { Component, useState } from "react"
import './Input.css';

function InputSection({setActiveTab,mintermsInput, variablesInput, setMintermsInput, setVariablesInput, setMintermsArray, setVariablesArray}) {
    
    return (
        <div className="input-container">
            <h1>Input Minterms and Variables</h1>
            <div className="sub-container">
                <InputComponent 
                    label="Minterms" 
                    value={mintermsInput} 
                    retrieveInput={setMintermsInput} 
                    placeholder="Example: 0,1,3,7,8,9,11,15"
                /> 
                <InputComponent 
                    label="Variables" 
                    value={variablesInput} 
                    retrieveInput={setVariablesInput} 
                    placeholder="Example: ABCD"
                />
                <SolveButton minterms={mintermsInput} variables = {variablesInput} HandleInputs={() => HandleInputs(mintermsInput, variablesInput)} setMintermsArray={setMintermsArray} setVariablesArray={setVariablesArray} setActiveTab={setActiveTab}/>
            </div>

        </div>
        
    ); 
}

/**
 * Input component that contains the label and input html element
 * @param {string} label - Description about the input
 * @param {string} value - The input itself
 * @param {function} retrieveInput - updates the values of either the mintermsInput or the variablesInput
 * 
 * @returns {Component} 
 */
function InputComponent({label, value, retrieveInput, placeholder}) { 
    // updates the state value depending on the what the user inputs
    function handleChange(event) {
        retrieveInput(event.target.value); 
    }

    return(
        <div className="input-component">
            <label>{label}</label>
            <input type="text" value={value} onChange={handleChange} placeholder={placeholder}></input>
        </div>
    )

}

function SolveButton({minterms, variables, HandleInputs, setMintermsArray, setVariablesArray, setActiveTab}) {

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
        <div className="button-container">
            <p className="errorText" >{errorText}</p>
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
    let maxMintermInput; 

    minterms = String(minterms.trim()); 
    let mintermsArray = minterms.split(","); 

    if (minterms.length === 0) {
        mintermsFormatMessage = 'Minterms input required'
    } else {
        for (let index = 0; index < mintermsArray.length; index++) {
            let trimmed = mintermsArray[index].trim();

            if (!/^\d+$/.test(trimmed)) {
                nonDigitMessage = 'Incorrect minterms input format. Minterms input should only be positive integers separated with commas';
                break; 
            }

            let element = parseFloat(trimmed); 
            if(!Number.isInteger(element) || element < 0) {
                nonDigitMessage = 'Incorrect minterms input format. Minterms input should only be positive integers separated with commas'; 
            } 
            else {
                mintermsArray[index] = parseFloat(mintermsArray[index]); 
            }
        }
    }

    const mintermsDuplicates = mintermsArray.filter((item, index) => mintermsArray.indexOf(item) !== index)

    if (mintermsDuplicates.length !== 0 && nonDigitMessage === '') {
        mintermDuplicatesMesage = 'Minterms should have no duplicates'; 
    }

    if (mintermsDuplicates.length === 0) {
        mintermsArray.sort((a, b) => a - b); 
        maxMintermInput = mintermsArray.at(-1); 
    }

    console.log(mintermsArray); 

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

    if (variables.length === 0) {
        variablesFormatMessage = 'Variables input required'
    } else {
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
    }

    const variablesDuplicates = variablesArray.filter((item, index) => variablesArray.indexOf(item) !== index)

    if (variablesDuplicates.length !== 0) {
        variableDuplicatesMessage = 'Variables should have no duplicates'; 
    }


    if (variablesDuplicates.length === 0) {
        if(variablesArray.length > 6) {
            sufficientVariablesMessage = 'Maximum number of variables for the input is only 10.'
        } else if (maxMintermInput > 1023) {
            sufficientVariablesMessage = 'Minterm value greater than 1023 is invalid as the maximum number of variables for the input is only 10'
        } else {
            let maxMintermValue = Math.pow(2, variablesArray.length) - 1; 
            if (maxMintermValue < maxMintermInput) {
                let quantityVariables = variablesArray.length; 
                while(Math.pow(2, quantityVariables) - 1 < maxMintermInput) {
                    quantityVariables++; 
                }
                if(quantityVariables == 6) {
                    sufficientVariablesMessage = 'Number of variables should be equal to ' + quantityVariables + ' or change the minterm input such that the maximum minterm value is ' + maxMintermValue; 
                } else {
                    sufficientVariablesMessage = 'Number of variables should be at least ' + quantityVariables + ' or change the minterm input such that the maximum minterm value is ' + maxMintermValue; 
                }
            }
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