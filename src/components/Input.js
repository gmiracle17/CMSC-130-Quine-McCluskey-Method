import { useState } from "react"
import './Input.css';

/**
 * Main function that renders the input section of the Quine McCluskey Method Solver
 * @param {function} setActiveTab - sets the tab to display in the browser
 * @param {string} mintermInput - state variable that contains the minterms inputted by the user
 * @param {string} variablesInput - state variable that contains the variables inputted by the user
 * @param {function} setMintermsInput - sets the value of the mintermsInput
 * @param {function} setVariablesInput - sets the value of the variablesInput
 * @param {function} setMintermsArray - sets the value of the mintermsArray
 * @param {function} setVariablesArray - sets the value of the variablesArray
 * @returns a component rendered in the browser where the user can type the input of minterms and variables, and press the solve button
 */
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
                <SolveButton 
                    mintermsInput={mintermsInput} 
                    variablesInput={variablesInput} 
                    HandleInputs={() => HandleInputs(mintermsInput, variablesInput)} 
                    setMintermsArray={setMintermsArray} setVariablesArray={setVariablesArray} 
                    setActiveTab={setActiveTab}
                />
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
 * @returns Component that has a label (eg. Variables) and the input element where the user will input
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

/**
 * 
 * @param {string} mintermsInput - minterms inputted by the user 
 * @param {variables} variablesInput - variables inputted by the user
 * @param {function} HandleInputs - checks if there any error when inputting the message
 * @param {function} setMintermsArray - sets the value of the mintermsArray state variable in App.js
 * @param {function} setVariablesArray - sets the value of the variablesArray state variable in App.js
 * @param {function} setActiveTab - sets the active tab. 
 * @returns A component that contains the p element that holds the error message if any and also the solve button
 */
function SolveButton({mintermsInput, variablesInput, HandleInputs, setMintermsArray, setVariablesArray, setActiveTab}) {

   const[errorText, setErrorText] = useState(''); 

   // creates an array for the variables and minterms and passes them as a parameter in setVariablesArray and setMintermsArray
   function setArrays() {
        let variablesArray = []; 
        for(let index = 0; index < variablesInput.length; index++) {
            variablesArray.push(variablesInput.charAt(index));
        }

        setVariablesArray(variablesArray); 
        let mintermsArray = mintermsInput.split(','); 
        for(let index = 0; index < mintermsArray.length; index++) {
            mintermsArray[index] = parseFloat(mintermsArray[index]);
        }
        setMintermsArray(mintermsArray); 
        
   }

    function onButtonClick() {
        let handleInputsArray = HandleInputs(); // returns an array of error messages based on the minterms and variables inputted by the user
        console.log(handleInputsArray);
        let message = ''; 
        // loop that combines all error messages in a single string
        for(let index = 0; index < handleInputsArray.length; index++) {
            if (handleInputsArray[index] !== '') {
                message = message + handleInputsArray[index] + '. '; 
            }
        }

        // if input is correct, proceed to pairwise simplification
        if (message === '') {
            setArrays(); 
            setActiveTab('pairwise');  
        } 
        else { // else display the message
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

/**
 * Checks the input of the user if there is any error
 * @param {string} mintermsInput - minterms inputted by the user
 * @param {string} variablesInput - variables inputted by the user
 * @returns an array of error messages
 */
function HandleInputs(mintermsInput, variablesInput) {
    let mintermsValidateArray = validateMinterms(mintermsInput); 
    let mintermErrorMessages = mintermsValidateArray.slice(0, mintermsValidateArray.length - 1);
    let variableErrorMessages = validateVariables(variablesInput, mintermsValidateArray[3]); 

    return [...mintermErrorMessages, ...variableErrorMessages]; 
}

/**
 * 
 * @param {string} mintermsInput - minterms inputted by the user
 * @returns an array of error messages based on the minterms inputted by the user
 */
function validateMinterms(mintermsInput) {
    // initialize the error messages
    let mintermsFormatMessage = '';
    let mintermDuplicatesMesage = ''; 
    let nonDigitMessage = '';
    let maxMintermInput; 

    mintermsInput = String(mintermsInput.trim()); // remove any leading or trailing white spaces
    let mintermsArray = mintermsInput.split(","); // split the minterms and store them into an array

    if (mintermsInput.length === 0) {
        mintermsFormatMessage = 'Minterms input required'
    } else {
        for (let index = 0; index < mintermsArray.length; index++) {
            let trimmed = mintermsArray[index].trim();

            if (!/^\d+$/.test(trimmed)) { // check if every element is a digit
                nonDigitMessage = 'Incorrect minterms input format. Minterms input should only be non-negative integers separated with commas (no trailing commas)';
                break; 
            }

            let element = parseFloat(trimmed); 
            if(!Number.isInteger(element) || element < 0) { // check if every element is only a non-negative integer
                nonDigitMessage = 'Incorrect minterms input format. Minterms input should only be non-negative integers separated with commas (no trailing commas)'; 
            } 
            else {
                mintermsArray[index] = parseFloat(mintermsArray[index]); 
            }
        }
    }

    // returns an array of duplicate minterms if any
    const mintermsDuplicates = mintermsArray.filter((item, index) => mintermsArray.indexOf(item) !== index)

    if (mintermsDuplicates.length !== 0 && nonDigitMessage === '') {
        mintermDuplicatesMesage = 'Minterms should have no duplicates'; 
    }

    if (mintermsDuplicates.length === 0) {
        mintermsArray.sort((a, b) => a - b); 
        maxMintermInput = mintermsArray.at(-1); 
    }

    return [mintermsFormatMessage, mintermDuplicatesMesage, nonDigitMessage, maxMintermInput];
}

/**
 * 
 * @param {*} variablesInput - variables inputted by the user
 * @param {*} maxMintermInput - highest minterm value inputted by the user
 * @returns an array of error messages based on the variables inputted by the user
 */
function validateVariables(variablesInput, maxMintermInput) {

    variablesInput = variablesInput.trim(); 

    // initialize error messages
    let variablesArray = []; 
    let variablesFormatMessage = ''; 
    let nonLetterMessage = '';
    let variableDuplicatesMessage = ''; 
    let sufficientVariablesMessage = '';

    if (variablesInput.length === 0) {
        variablesFormatMessage = 'Variables input required'
    } else {
        for (let index = 0; index < variablesInput.length; index++) {
            let char = variablesInput.charAt(index); 
    
            if (char === " ") {
                variablesFormatMessage = 'Incorrect variables format. Ensure there are no spaces';
            } else {
                variablesArray.push(char);
                if (!/[a-zA-Z]/.test(char)) { // check if the character is a valid english alphabet letter
                    nonLetterMessage = 'Variables inputted should only English Alphabet letters with no spaces in between';
                }
            }
        }
    }

    // returns an array of duplicate variables if any
    const variablesDuplicates = variablesArray.filter((item, index) => variablesArray.indexOf(item) !== index)

    if (variablesDuplicates.length !== 0) {
        variableDuplicatesMessage = 'Variables should have no duplicates'; 
    }


    if (variablesDuplicates.length === 0 && variablesInput.length > 0) {
        if(variablesArray.length > 6) {
            sufficientVariablesMessage = 'Maximum number of variables for the input is only 6.'
        } else if (maxMintermInput > 63) {
            sufficientVariablesMessage = 'Minterm value greater than 63 is invalid as the maximum number of variables for the input is only 6'
        } else {
            let maxMintermValue = Math.pow(2, variablesArray.length) - 1; 
            if (maxMintermValue < maxMintermInput) {
                let quantityVariables = variablesArray.length; 
                while(Math.pow(2, quantityVariables) - 1 < maxMintermInput) {
                    quantityVariables++; 
                }
                if(quantityVariables === 6) {
                    sufficientVariablesMessage = 'Number of variables should be equal to ' + quantityVariables + ' or change the minterm input such that the maximum minterm value is ' + maxMintermValue; 
                } else {
                    sufficientVariablesMessage = 'Number of variables should be at least ' + quantityVariables + ' or change the minterm input such that the maximum minterm value is ' + maxMintermValue; 
                }
            }
        }
    }

    return [variablesFormatMessage, nonLetterMessage, variableDuplicatesMessage, sufficientVariablesMessage]; 
}

export default InputSection; 