import React from 'react';
import './POS.css';

function POS({ minterms, variables, essentialPrimeImplicants, neededNonessentialPrimeImplicants }) {
    function getPOS(essentialPrimeImplicants, neededNonessentialPrimeImplicants) {
        const totalTerms = 2 ** variables.length;
        const allTerms = Array.from({ length: totalTerms }, (term, index) => index);
    
        const inputMinterms = [];
        minterms.forEach((m) => {inputMinterms.push(Number(m));});

        let containsAllTerms = true;

        if (inputMinterms.length !== allTerms.length) {
            containsAllTerms = false;
        } 
        else {
            allTerms.forEach((m) => {
            if (inputMinterms.indexOf(m) === -1) {
                    containsAllTerms = false;
                }
            });
        }

        if (containsAllTerms) { return "1"; }
    
        const finalPrimeImplicants = essentialPrimeImplicants.concat(neededNonessentialPrimeImplicants);
        const posTerms = finalPrimeImplicants.map(primeImplicant => {
            const literals = primeImplicant.match(/([A-Z]')|[A-Z]/g);
            const term = literals.map(literal => {
                if (literal.includes("'")) {
                    return literal[0];
                } else {
                    return literal[0] + "'";
                }
            }).join('+');
            return "(" + term + ")";
        });
    
        return posTerms.join(' ');
    }    

    const finalAnswer = getPOS(essentialPrimeImplicants, neededNonessentialPrimeImplicants);
    // final Answer = 1 if minterms contains 0 - 2 ** variables

    return (
        <div>
            <div className="container">
                <h1 className="answerHeader">Product of Sums Form</h1>
                <p className="given">Given: F({Array.from(variables).join(', ')}) = ∑({Array.from(minterms).join(', ')})</p>
                <p className="answer">{finalAnswer}</p>
            </div>
            <small>Note: Please visit Prime Implicant Table Tab to update expression</small>
        </div>
    );
}

export default POS;
