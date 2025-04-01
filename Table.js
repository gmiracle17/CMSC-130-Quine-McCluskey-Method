/* To add in the future:
    - For Input.js please pass variables and minterms
    - For Pairwise.js please pass binaryList and maxtermsList
    - Retrieving of essential prime implicants and storing in essentialPrimeImplicantsList
    - Displaying them below table
    - Retrieving and storing groups of POS minimization (can be more than one)
    - Checking of minterms (either by checking or changing font color not yet sure)
    - Gray? Purple? Red? Highlight for entire essential row or at least prime implicant
    - Pass groups of POS minimization to POS.js for display
*/
import React from 'react';
import '../App.css';

function Table() {
    const variables = ["A", "B", "C", "D"]; // from Input
    const minterms = [0, 1, 3, 7, 8, 9, 11, 15]; // from Input
    const binaryList = ["_00_", "_0_1", "__11"]; // from Pairwise
    const maxtermsList = ["0-1-8-9", "1-3-9-11", "3-7-11-15"]; // from Pairwise

    /* Getting Prime Implicants from Binary List */
    const primeImplicantsList = [];
    for (let i = 0; i < binaryList.length; i++) {
        const binaryString = binaryList[i];
        let primeImplicant = '';

        for (let j = 0; j < binaryString.length; j++) {
            if (binaryString[j] === "0") {
                primeImplicant += variables[j] + "'";
            } else if (binaryString[j] === "1") {
                primeImplicant += variables[j];
            }
        }
        primeImplicantsList.push(primeImplicant);
    }

    const columns = []; 
    for (let i = 0; i < minterms.length; i++) {
        columns.push(
            <div key={i} className="mintermColumn">
                {minterms[i]}
            </div>
        );
    }

    const rows = [];
    const xCounts = new Array(minterms.length).fill(0); // Array to count X in column

    /* Create rows and count X entries */
    for (let j = 0; j < maxtermsList.length; j++) {
        const maxterm = maxtermsList[j].split('-').map(Number);
        const row = (
            <div key={j} className="tableRow">
                <div className="primeImplicantEntries">{primeImplicantsList[j]}</div>
                <div className="maxtermEntries">{maxtermsList[j]}</div>
                {columns.map((column, index) => {
                    const isX = maxterm.includes(minterms[index]);
                    if (isX) xCounts[index]++; // increment count when there is X entry
                    return (
                        <div key={index} className="xEntries">
                            {isX ? 'X' : ''}
                        </div>
                    );
                })}
            </div>
        );
        rows.push(row);
    }

    /* Mark essential X entries */
    const essentialRows = rows.map((row, j) => {
        const maxterm = maxtermsList[j].split('-').map(Number);
        return (
            <div key={j} className="tableRow">
                <div className="primeImplicantEntries">{primeImplicantsList[j]}</div>
                <div className="maxtermEntries">{maxtermsList[j]}</div>
                {columns.map((column, index) => {
                    const isX = maxterm.includes(minterms[index]);
                    const isEssential = isX && xCounts[index] === 1; // Check if it's essential
                    return (
                        <div key={index} className={`xEntries ${isEssential ? 'essential' : ''}`}>
                            {isX ? 'X' : ''}
                        </div>
                    );
                })}
            </div>
        );
    });

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableColumn">Prime Implicants</div>
                <div className="tableColumn">Maxterms</div>
                {columns}
            </div>
            {essentialRows} 
        </div>
    );
}

export default Table;