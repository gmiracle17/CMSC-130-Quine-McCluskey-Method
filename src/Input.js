import { useState } from "react"

function InputSection() {
    const[minterms, setMinterms] = useState(""); 
    const[variables, setVariables] = useState(""); 
    const[errorText, setErrorText] = useState(""); 

    return (
        <div className="input-container">
            <h1>Quine-McCluskey Method Solver</h1>
            <div className="sub-container">
                <MintermsInput value={minterms} retrieveMinterms={setMinterms}/>
                <VariablesInput value={variables} retrieveVariables={setVariables}/>
                <p></p>
                <SolveButton onButtonClick={() => HandleInputs(minterms, variables)}/>
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

function SolveButton({onButtonClick}) {

    return(
        <div>

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

let mintermsFormatCorrect = true;
let noMintermDuplicates = true; 
let noNonDigit = true;
let maxNumber; 

minterms = minterms.trim(); 
let mintermsArray = minterms.split(','); 

for (let index = 0; index < mintermsArray.length; index++) {
    if(!Number.isInteger(parseFloat(mintermsArray[index]))) {
        noNonDigit = false; 
    }
    else {
        mintermsArray[index] = parseFloat(mintermsArray[index]); 
    }
}

const mintermsDuplicates = mintermsArray.filter((item, index) => mintermsArray.indexOf(item) !== index)

if (mintermsDuplicates.length != 0) {
    noMintermDuplicates = false; 
}


if (noNonDigit === true) {
    mintermsArray.sort(); 
    maxNumber = mintermsArray.at(-1); 
}

console.log("Minterms"); 
console.log(noMintermDuplicates); 
console.log(noNonDigit); 
/* 
variables 
1. remove any leading or trailing white spaces
2. transform into an array
3. Check for any duplicates. 
4. Check if it has sufficient variables depending on the minterms. 
*/

variables = variables.trim(); 
let variablesArray = []; 
let variablesFormatCorrect = true; 
let noNonLetter = true; 
let noVariableDuplicates = true; 
let sufficientVariables = true;

for (let index = 0; index < variables.length; index++) {
    let char = variables.charAt(index); 

    if (char === " ") {
        variablesFormatCorrect = false;
    } else {
        variablesArray.push(char);
        if (!/[a-zA-Z]/.test(char)) {
            noNonLetter = false;
        }
    }
}


const variablesDuplicates = variablesArray.filter((item, index) => variablesArray.indexOf(item) !== index)

if (variablesDuplicates.length != 0) {
    noVariableDuplicates = false; 
}

if (noVariableDuplicates == true) {
    if (Math.pow(2, variablesArray.length) - 1 < maxNumber) {
        sufficientVariables = false; 
    }
}

console.log("Variables")
console.log(variablesFormatCorrect);
console.log(noNonLetter); 
console.log(noVariableDuplicates); 
console.log(sufficientVariables); 

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