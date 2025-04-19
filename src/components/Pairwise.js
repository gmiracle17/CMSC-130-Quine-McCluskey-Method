import React from 'react';
import { useEffect } from 'react';
import './Pairwise.css';


/**
 * Main function responsible for Pairwise Simplification
 * @param mintermsArray - array containing minterms inputted by the user sorted from least to greatest (eg. [0,1,2,3])
 * @param variablesArray - array containing variables inputed by the user (eg. [A,B,C,D])
 * @param {function} setBinaryList - function passed as prop to set Binary List of Prime Implicants 
 * @param {function} setMintermsList - function passed as prop to set Minterms List of Prime Implicants
 * @returns Grouped Minterms Table and Pairwise Simplfication Table Rounds
 */
function Pairwise({mintermsArray, variablesArray, setBinaryList, setMintermsList}) {
    
    // Get all posible minterms based on the number of variables
    const allMinterms = getAllPossibleMinterms(variablesArray); 
    
    // Get all minterms not included in the minterms inputted by the user
    const complementMintermsArray = allMinterms.filter(m => !mintermsArray.includes(m));

    let allTables = []; // holds all the tables which are each represented by a map
    
    // create a map wherein key = group number (number of ones), value = array of minterm objects
    let groupMap = createGroupMap(complementMintermsArray, variablesArray); 
    allTables.push(groupMap);
    let primeImplicantsList = []; // holds all prime implicants objects
    
    let round = 1;

    // Run this loop until no more matched pairs are found
    while (true) {
        let matchedPairsMap = new Map(); 

        // For each group map, compare the binary representation of the minterms or matched pairs of group n and group n + 1
        for (const key of groupMap.keys()) {
            
            // If group n + 1 does not exist, no comparison can be made and must move to next group for comparison.
            if (!groupMap.has(key + 1)) {
                continue; 
            }
            
            let mintermsObjectsArray1 = groupMap.get(key); 
            let mintermsObjectsArray2 = groupMap.get(key + 1); 
            matchPairs(mintermsObjectsArray1, mintermsObjectsArray2, matchedPairsMap); // main function for checking for matched pairs
        }

        // After a round of pairwise simplification, get all unmatched pairs or unmatched minterms if there is any and store it into prime implicant list
        getAllUnmatchedPairs(groupMap, primeImplicantsList);

        // condition needed to break the loop
        if(matchedPairsMap.size === 0) { 
            break; 
        }

        // For round 4 and up, duplicate minterms will not be shown for better visualization
        if (round > 3) {
            for(const key of matchedPairsMap.keys()) {
                let group = matchedPairsMap.get(key);
                let cleanedGroup = removeDuplicates(group);
                matchedPairsMap.set(key, cleanedGroup);
            }
        }

        round++;

        allTables.push(matchedPairsMap); 
        groupMap = matchedPairsMap; // set the matchPairsMap as the new groupMap to check if there is any new matched pairs
        
    }

    // Remove any duplicate prime implicants
    primeImplicantsList = removeDuplicates(primeImplicantsList); 

    //console.log(allTables);
    //console.log(getBinaryList(primeImplicantsList)); 
    //console.log(getMintermsList(primeImplicantsList));  
    
    // Set the binary list and minterms list that will be used for PrimeImplicant.js
    useEffect(() => {
        setBinaryList(getBinaryList(primeImplicantsList));
        setMintermsList(getMintermsList(primeImplicantsList));
      }, []);
    
    if (complementMintermsArray.length === 0) {
        return (
            <div>
                <p className='title'>No pairwise simplification needed since there are no compliment minterms</p>
            </div>
        ); 
    }

    return (
        <div className='pairwise-container'>
            <GivenFunction mintermsArray={mintermsArray} variablesArray={variablesArray} />
            <MintermsTable groupMap={allTables[0]}/>
            <h1 className='title'>Pairwise Simplification</h1>
            <p className='subtitle'>This is done by comparing the minterms of group n and n+1 and pairing them up if they differ by only 1 variable</p>
            {
                allTables.map((groupMap, index) => <SimplificationTable groupMap={groupMap} index={index} variablesArray = {variablesArray} getVariableEquivalent={getVariableEquivalent}/>)
            }
        </div>
    );
}

// Minterm object for each table containing necessary information
class MintermObject {
    constructor(minterms, binary, groupNum) {
      this.minterms = minterms; // either a single minterm or a matched pair which is a string of merged minterms using -
      this.binary = binary;     // binary representation using string with "_"
      this.groupNum = groupNum; // number of ones in the binary representation
      this.isMatched = false; // status if minterm or matched pair is matched
    }
}

/**
 * 
 * @param {Array} mintermsInput - minterms inputted by the user
 * @param {Array} variablesInput - variables inputted by the user
 * @returns Component displaying the given boolean function in notation form
 */
function GivenFunction({mintermsArray, variablesArray}) {

    let variablesDisplay = ''; 
    for(let index = 0; index < variablesArray.length; index++) {
        variablesDisplay += variablesArray[index]; 
        if (index !== variablesArray.length - 1) {
            variablesDisplay += ', '
        }
    }
    
    let mintermsDisplay = ''; 
    for(let index = 0; index < mintermsArray.length; index++) {
        mintermsDisplay += mintermsArray[index]; 
        if (index !== mintermsArray.length - 1) {
            mintermsDisplay += ', '
        }
    }

    return(
        <div className='given'>
            <h1>Given: F({variablesDisplay}) = ∑({mintermsDisplay})</h1>
        </div>
    ); 
}

/**
 * 
 * @param {Map} groupMap - contains the group number as key and the array of minterm objects as the value
 * @returns Component displaying a dynamic table containing the minterms grouped based on the number of ones in the binary representation
 */
function MintermsTable({groupMap}) {
    return (
        <div className='table-container'>
            <p>Grouping of minterms based on number of ones</p>
            <p>Minterms grouped are those that make the function zero as the simplified boolean function is in Product of Sums form</p>
            <table>
                <thead>
                    <tr>
                        <th>Group Number</th>
                        <th>Minterm</th>
                        <th>Binary representation</th>
                    </tr>
                </thead>
                <tbody>
                    {[...groupMap.entries()].map(([groupNumber, mintermsObjectArray]) => 
                        mintermsObjectArray.map(obj => (
                            <tr>
                                <td>{groupNumber}</td>
                                <td>{obj.minterms}</td>
                                <td>{obj.binary}</td>
                            </tr>
                        ))
                    
                    )}
                </tbody>
            </table>


        </div>
    ); 
}

/**
 * 
 * @param {Map} groupMap - contains the group number as key and the array of minterm objects as the value
 * @param {int} index - index based on allTables array
 * @param {Array} variablesArray - array of variables inputted by the user
 * @param {function} getVariableEquivalent - function that converts a binary representation to variable representation 
 * @returns Table for one round of pairwise simplification
 */
function SimplificationTable({groupMap, index, variablesArray, getVariableEquivalent}) {
    return(
        <div className='table-container'>
            <p>{(index === 0) ? '' : 'Round ' + index + ' Pairing'}</p>
            <p>{(index === 4) ? 'Duplicate matched pairs are not shown for round 4 and up.' : ''}</p>
            <table>
                <thead>
                    <tr>
                        <th>Group Number</th>
                        <th>{(index === 0) ? 'Minterm' : 'Matched Pairs'}</th>
                        <th>Binary Representation</th>
                        <th>Is Matched?</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {[...groupMap.entries()].map(([groupNumber, mintermsObjectArray]) => 
                        mintermsObjectArray.map(obj => (
                            <tr>
                                <td>{groupNumber}</td>
                                <td>{obj.minterms}</td>
                                <td>{obj.binary}</td>
                                <td>{obj.isMatched ? 'Yes' : 'No'}</td>
                                <td>{obj.isMatched ? '': getVariableEquivalent(obj.binary, variablesArray)}</td>
                            </tr>
                        ))
                    
                    )}
                </tbody>
            </table>
        </div>
        
    ); 

}

/**
 * 
 * @param {Array} variablesArray - array of variables inputted by the user
 * @returns array of all minterms based on the number of variables
 */
function getAllPossibleMinterms(variablesArray) {
    let allMinterms = []; 
    // All minterms are from 0 to 2^n - 1 where n is the number of variables
    for(let index = 0; index < Math.pow(2, variablesArray.length); index++) {
        allMinterms.push(index); 
    }

    return allMinterms; 

}

/**
 * 
 * @param {int} minterm - minterm in integer value 
 * @param {Array} variablesArray - array of variables inputted by the user
 * @returns binary equivalent of a minterm that is in integer
 */
function getBinaryEquivalent(minterm, variablesArray) { 
    let binaryEquivalent = ''; 
    let remainingValue = minterm

    for(let value = variablesArray.length - 1; value >= 0; value--) {
        if(Math.pow(2, value) <= remainingValue) {
            remainingValue -= Math.pow(2, value); 
            binaryEquivalent += '1'; 
        }
        else {
            binaryEquivalent += '0'; 
        }
    }

    return binaryEquivalent; 

}

/**
 * 
 * @param {string} binaryEquivalent - binary representation of a minterm or matched pair
 * @param {Array} variablesArray - array of variables inputted by the user
 * @returns variable equivalent of a binary representation
 */
function getVariableEquivalent(binaryEquivalent, variablesArray) {
    let variableEquivalent = ''; 

    for(let index = 0; index < variablesArray.length; index++) {
        if(binaryEquivalent[index] === '0') {
            variableEquivalent += variablesArray[index] + "'"; // add a ' if the element is a zero
        } else if (binaryEquivalent[index] === '1') {
            variableEquivalent += variablesArray[index]; 
        }
    }

    return variableEquivalent; 

}

/**
 * 
 * @param {string} binaryEquivalent - binary equivalent of a minterm or matched pair
 * @returns the number of ones on a binary representation
 */
function getNumberOfOnes(binaryEquivalent) {
    let numberOfOnes = 0; 
    for(let index = 0; index < binaryEquivalent.length; index++) {
        if(binaryEquivalent[index] === '1') {
            numberOfOnes++; 
        }
    }
    return numberOfOnes; 
}

/**
 * Inserts a new instantiated minterm object in a map based on its group number (number of ones in binary representation)
 * @param {Map} groupMap - contains the group number as key and the array of minterm objects as the value. It represents the data of a table in pairwise simplification
 * @param {int} minterms - minterm in int or matched pair
 * @param {string} binaryEquivalent - binary equivalent of a minterm
 * @param {int} numberOfOnes - number of ones of a binary equivalent of a minterm
 */
function insertInMap(groupMap, minterms, binaryEquivalent, numberOfOnes) {
    let mintermsObjectsArray = []; 

    if(groupMap.has(numberOfOnes)) {
        groupMap.get(numberOfOnes).push(new MintermObject(minterms, binaryEquivalent, numberOfOnes)); 
    }
    else {
        mintermsObjectsArray.push(new MintermObject(minterms, binaryEquivalent, numberOfOnes)); 
        groupMap.set(numberOfOnes, mintermsObjectsArray); 
    }

}

/**
 * 
 * @param {array} complementMintermsArray - array of minterms not included on the minterms inputted by the user
 * @param {array} variablesArray - array of variables inputted by the user
 * @returns a map wherein key = group number (number of ones in the binary representation of a minterm), value = array of minterms objects
 */
function createGroupMap(complementMintermsArray, variablesArray) {
    let groupMap = new Map(); 
    
    for(let index = 0; index < complementMintermsArray.length; index++) {
        let mintermElement = complementMintermsArray[index]
        let binaryEquivalent = getBinaryEquivalent(mintermElement, variablesArray); 
        let numberOfOnes = getNumberOfOnes(binaryEquivalent); 

        insertInMap(groupMap, mintermElement, binaryEquivalent, numberOfOnes); 

    }
    
    return groupMap; 
}

/**
 * 
 * @param {string} binary1 - binary equivalent of a minterm object from group n
 * @param {string} binary2 - binary equivalent of a minterm object from group n + 1
 * @returns a new binary representation of the matched pair if they differ by 1 bit/variable, otherwise null
 */
function canCombine(binary1, binary2) {
    let difference = 0; 
    let newBinary = ''; 

    for(let index = 0; index < binary1.length; index++) {
        if(binary1[index] !== binary2[index]) {
            newBinary += '_'; // adds an underscore on the index where binary1 and binary2 differs
            difference++; 
            if (difference > 1) return null; // returns null if binary1 and binary2 are not different by only 1 bit/variable
        }
        else {
            newBinary += binary1[index]; 
        }
    }

    return newBinary;

}

/**
 * Checks if the binary representation of every minterm or existing matched pair can be matched from group n to those in group n + 1. If so, placed them in the matchedPairsMap.
 * @param {Array} mintermsObjectsArray1 - contains mintermObjects from group n 
 * @param {Array} mintermsObjectsArray2 - contains mintermObjects from group n + 1
 * @param {Map} matchedPairsMap - a map wherein an array of new matched mintermObjects are placed during the current round of pairwise simplification as a value based on the key which is the group number.
 */
function matchPairs(mintermsObjectsArray1, mintermsObjectsArray2, matchedPairsMap) {
    for(let i = 0; i < mintermsObjectsArray1.length; i++) {
        let binary1 = mintermsObjectsArray1[i].binary; 

        for(let j = 0; j < mintermsObjectsArray2.length; j++) {
    
            let binary2 = mintermsObjectsArray2[j].binary; 
            let newBinary = canCombine(binary1, binary2); 

            // if a binary representation is created from the two binaries of the two mintermObjects being matched, then insert in the matched pairs map
            if(newBinary !== null) { 
                let minterms = [mintermsObjectsArray1[i].minterms, mintermsObjectsArray2[j].minterms].join('-');
                let numberOfOnes = getNumberOfOnes(newBinary); 
                mintermsObjectsArray1[i].isMatched = true; // set these mintermObjects as matched.
                mintermsObjectsArray2[j].isMatched = true; 
                insertInMap(matchedPairsMap, minterms, newBinary, numberOfOnes);     
            }

        }

    }

}

/**
 * Inserts all mintermObjects that are unmatched to the primeImplicantsList
 * @param {Map} groupMap - map that contains the group number as key and the array of minterm objects as the value.
 * @param {Array} primeImplicantsList - contains all prime implicants (all mintermObjects that are not matched)
 */
function getAllUnmatchedPairs(groupMap, primeImplicantsList) {
    for (const group of groupMap.values()) {
        for (let i = 0; i < group.length; i++) {
            if (group[i].isMatched === false) {
                primeImplicantsList.push(group[i]); 
            }
        }
    }
}

/**
 * 
 * @param {Array} mintermObjectsList - an array of mintermObjects that may have the same binary representation
 * @returns a new mintermObjects Array wherein all have unique binary representation.
 */
function removeDuplicates(mintermObjectsList) {
    const binaryList = new Set(); 
    return mintermObjectsList.filter((mintermObject) => {
        if (binaryList.has(mintermObject.binary)) {
            return false; 
        }
        else {
            binaryList.add(mintermObject.binary) 
            return true; 
        }
    }); 
    
}

/**
 * 
 * @param {*} primeImplicantsList - contains all prime implicants (all mintermObjects that are not matched)
 * @returns a list of binary representation of all prime implicants
 */
function getBinaryList(primeImplicantsList) {
    let binaryList = []; 
    for(const primeImplicant of primeImplicantsList) {
        binaryList.push(primeImplicant.binary); 
    }

    return binaryList; 

}

/**
 * 
 * @param {*} primeImplicantsList - contains all prime implicants (all mintermObjects that are not matched)
 * @returns a list of all minterm or matched pairs (eg. ["1-3", "2-3"]) of all prime implicants
 */
function getMintermsList(primeImplicantsList) {
    let mintermList = []; 
    for (const primeImplicant of primeImplicantsList) {
        mintermList.push(String(primeImplicant.minterms)) 
    }

    return mintermList; 

}

export default Pairwise;