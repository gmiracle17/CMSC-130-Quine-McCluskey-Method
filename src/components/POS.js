import React from 'react';
import './POS.css';

/**
 * POS Component that displays the final minimized expression in Product of Sums (POS) form.
 * 
 * @param {Array} variables - array of Boolean variables (e.g. ['A', 'B', 'C']) retrieved from Input.js
 * @param {Array} minterms - array of minterms (e.g. [1, 4, 5]) retrieved from Input.js
 * @param {Array} essentialPrimeImplicants - array of essential prime implicants (e.g. ["BD'", "AD"]) retrieved from PrimeImplicantTable.js
 * @param {Array} neededNonessentialPrimeImplicants - array of nonessential prime implicants needed in final expression retrieved from PrimeImplicantTable.js
 * 
 * @returns {JSX.Element} POS form representation of the minimized expression
 */
function POS({ minterms, variables, essentialPrimeImplicants, neededNonessentialPrimeImplicants }) {
    
    /**
     * Function to generate POS expression.
     * 1. Check if minterms cover all possible terms from 0 to 2^n-1
     * 2.1 If all terms are covered, return "1"
     * 2.2 If not, combine essential and needed nonessential prime implicants and format them into POS
     * 
     * @param {Array} essentialPrimeImplicants - array of essential prime implicants
     * @param {Array} neededNonessentialPrimeImplicants - array of needed nonessential prime implicants
     * 
     * @returns {String} POS expression
     */
    function getPOS(essentialPrimeImplicants, neededNonessentialPrimeImplicants) {
        const totalTerms = 2 ** variables.length;
        const allTerms = Array.from({ length: totalTerms }, (term, index) => index);
        const inputMinterms = minterms.map(Number);

        let containsAllTerms = allTerms.every(term => inputMinterms.includes(term));
        if (containsAllTerms) return "1";
    
        const finalPrimeImplicants = essentialPrimeImplicants.concat(neededNonessentialPrimeImplicants);
        const posTerms = finalPrimeImplicants.map(primeImplicant => {
            const literals = primeImplicant.match(/([a-zA-Z]')|[a-zA-Z]/g);
            const term = literals.map(literal => {
                return literal[0] + (literal.includes("'") ? "" : "'")
            }).join('+');
            return "(" + term + ")";
        });
    
        return posTerms.join(' ');
    }    

    const finalAnswer = getPOS(essentialPrimeImplicants, neededNonessentialPrimeImplicants);

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