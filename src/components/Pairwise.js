import React from 'react';
import { useEffect } from 'react';
import './Pairwise.css';

function Pairwise({mintermsArray, variablesArray, setBinaryList, setMintermsList}) {
    
    const allMinterms = getAllPossibleMinterms(variablesArray); 
    const complementMintermsArray = allMinterms.filter(m => !mintermsArray.includes(m));

    let allTables = []; 
    let groupMap = createGroupMap(mintermsArray, variablesArray); 
    allTables.push(groupMap);
    let primeImplicantsList = []; 

    while (true) {
        let matchedPairsMap = new Map(); 
        
        for (const key of groupMap.keys()) {
            if (!groupMap.has(key + 1)) {
                continue; 
            }
            
            let mintermsObjectsArray1 = groupMap.get(key); 
            let mintermsObjectsArray2 = groupMap.get(key + 1); 
            matchPairs(mintermsObjectsArray1, mintermsObjectsArray2, matchedPairsMap); 
        }

        getAllUnmatchedPairs(groupMap, primeImplicantsList);


        if(matchedPairsMap.size === 0) {
            break; 
        }

        allTables.push(matchedPairsMap); 
        groupMap = matchedPairsMap; 
        
    }
    primeImplicantsList = removeDuplicates(primeImplicantsList); 

    console.log(allTables);
    console.log(getBinaryList(primeImplicantsList)); 
    console.log(getMintermsList(primeImplicantsList));  
    
    useEffect(() => {
        setBinaryList(getBinaryList(primeImplicantsList));
        setMintermsList(getMintermsList(primeImplicantsList));
      }, []);

    return (
        <div className='pairwise-container'>
            <p>Pairwise Simplification</p>
            <p>This is done by comparing the minterms of group n and n+1 and pairing them up if they differ by only 1 variable</p>
            {
                allTables.map((groupMap, index) => <SimplificationTable groupMap={groupMap} index={index} variablesArray = {variablesArray} getVariableEquivalent={getVariableEquivalent}/>)
            }
        </div>
    );
}

class MintermObject {
    constructor(minterms, binary, groupNum) {
      this.minterms = minterms; // string of merged minterms using -
      this.binary = binary;     // string with "_" for dashes
      this.groupNum = groupNum;
      this.isMatched = false;
    }
}
  

function SimplificationTable({groupMap, index, variablesArray, getVariableEquivalent}) {
    return(
        <div className='table-container'>
            <p>{(index === 0) ? '' : 'Round ' + index + ' Pairing'}</p>
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

function getAllPossibleMinterms(variablesArray) {
    let allMinterms = []; 
    for(let index = 0; index < Math.pow(2, variablesArray.length); index++) {
        allMinterms.push(index); 
    }

    return allMinterms; 

}

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

function getVariableEquivalent(binaryEquivalent, variablesArray) {
    let variableEquivalent = ''; 

    for(let index = 0; index < variablesArray.length; index++) {
        if(binaryEquivalent[index] === '0') {
            variableEquivalent += variablesArray[index] + "'"; 
        } else if (binaryEquivalent[index] === '1') {
            variableEquivalent += variablesArray[index]; 
        }
    }

    return variableEquivalent; 

}

function getNumberOfOnes(binaryEquivalent) {
    let numberOfOnes = 0; 
    for(let index = 0; index < binaryEquivalent.length; index++) {
        if(binaryEquivalent[index] === '1') {
            numberOfOnes++; 
        }
    }
    return numberOfOnes; 
}

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

function canCombine(binary1, binary2) {
    let diff = 0; 
    let newBinary = ''; 

    for(let index = 0; index < binary1.length; index++) {
        if(binary1[index] !== binary2[index]) {
            newBinary += '_'; 
            diff++; 
        }
        else {
            newBinary += binary1[index]; 
        }
    }

    return diff === 1 ? newBinary : null;

}

function matchPairs(mintermsObjectsArray1, mintermsObjectsArray2, matchedPairsMap) {
    for(let i = 0; i < mintermsObjectsArray1.length; i++) {
        for(let j = 0; j < mintermsObjectsArray2.length; j++) {
            let binary1 = mintermsObjectsArray1[i].binary; 
            let binary2 = mintermsObjectsArray2[j].binary; 
            let newBinary = canCombine(binary1, binary2); 

            if(newBinary !== null) {
                let minterms = [mintermsObjectsArray1[i].minterms, mintermsObjectsArray2[j].minterms].join('-');
                let numberOfOnes = getNumberOfOnes(newBinary); 
                mintermsObjectsArray1[i].isMatched = true; 
                mintermsObjectsArray2[j].isMatched = true; 
                insertInMap(matchedPairsMap, minterms, newBinary, numberOfOnes);     
            }

        }

    }

}

function getAllUnmatchedPairs(groupMap, primeImplicantsList) {
    for (const [key, group] of groupMap.entries()) {
        for (let i = 0; i < group.length; i++) {
            if (group[i].isMatched === false) {
                primeImplicantsList.push(group[i]); 
            }
        }
    }
}

function removeDuplicates(primeImplicantsList) {
    const binaryList = new Set(); 
    return primeImplicantsList.filter((primeImplicant) => {
        if (binaryList.has(primeImplicant.binary)) {
            return false; 
        }
        else {
            binaryList.add(primeImplicant.binary) 
            return true; 
        }
    }); 
    
}

function getBinaryList(primeImplicantsList) {
    let binaryList = []; 
    for(const primeImplicant of primeImplicantsList) {
        binaryList.push(primeImplicant.binary); 
    }

    return binaryList; 

}

function getMintermsList(primeImplicantsList) {
    let mintermList = []; 
    for (const primeImplicant of primeImplicantsList) {
        mintermList.push(primeImplicant.minterms) 
    }

    return mintermList; 

}

export default Pairwise;