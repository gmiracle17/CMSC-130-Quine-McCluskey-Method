import React, { useEffect } from 'react';
import './PrimeImplicantTable.css';

/**
 * Prime Implicant Table Component - visualizes relationship between prime implicants and maxterms in a table,
 * highlighting essential and needed non-essential prime implicants for simplification
 *
 * @param {Array} variables - array of Boolean variables (e.g., ['A', 'B', 'C']) from Input.js
 * @param {Array} minterms - array of minterm numbers (e.g., [1, 4, 5]) from Input.js
 * @param {Array} maxtermsList - array of maxterm groupings (e.g., ["2-6-10", "3-7-11"]) from Pairwise.js
 * @param {Array} binaryList - array of binary representations for prime implicants (e.g., ["010_", "_110"]) from Pairwise.js
 * @param {Function} setEssentialPrimeImplicants - callback to store essential prime implicants in App.js for POS.js to use
 * @param {Function} setNeededNonessentialPrimeImplicants - callback to store needed non-essential prime implicants in App.js for POS.js to use
 * 
 * @returns {JSX.Element} Table showing prime implicants, coverage of maxterms, and essential/needed nonessential prime implicants
 */

function PrimeImplicantTable({ variables, minterms, maxtermsList, binaryList, setEssentialPrimeImplicants, setNeededNonessentialPrimeImplicants }) {
    /**
     * Generate primeImplicantsList - array of prime implicants from the binary representation
     */
    const primeImplicantsList = binaryList.map(binary => {
        if (binary.length === 1) {
            return binary === '0' ? variables[0] + "'" : variables[0];
        }
        return binary.split('').map((bit, i) =>
            bit === '0' ? variables[i] + "'" :
            bit === '1' ? variables[i] : ''
        ).join('');
    });

    /**
     * Generate maxterms - array of maxterms (terms not in minterms) by creating array of all terms from 0 to 2^n-1
     * and excluding terms that are in minterms
     */
    const totalTerms = 2 ** variables.length; // maxterms + minterms
    const maxterms = Array.from({ length: totalTerms }, (term, index) => index).filter(index => !minterms.includes(index));

    /**
     * Maxterm Column headers for the table based on maxterms
     */
    const maxtermColumns = maxterms.map((maxterm, i) => (
        <div key={i} className="maxtermColumn">{maxterm}</div>
    ));

    /**
     * Generate xMap - maps prime implicants to the maxterms they cover
     */
    const xMap = maxtermsList.map(maxtermGroup => {
        const maxtermGroupStr = String(maxtermGroup);
        const coveredSet = maxtermGroupStr.includes('-') ? new Set(maxtermGroupStr.split('-').map(Number)) : new Set([Number(maxtermGroupStr)]);
        
        return maxterms.map(maxterm => coveredSet.has(maxterm));
    });            

    /**
     * Generate xCounts - maps count of prime implicants that cover each maxterm
     */
    const xCounts = maxterms.map((maxterm, maxtermIndex) =>
        xMap.reduce((count, primeImplicantRow) => count + (primeImplicantRow[maxtermIndex] ? 1 : 0), 0)
    );

    /**
     * Getting essential prime implicants and maxterms covered by them
     * 1. Check column with xCounts = 1
     * 2. Find prime implicant using respective row index
     * 3. Add prime implicant to essentialPrimeImplicants (set of essential prime implicants)
     * 4. Get maxterms covered by said prime implicant and store them in maxtermsCoveredByEssentialPIs for tracking
     */
    const essentialPrimeImplicants = new Set();
    const maxtermsCoveredByEssentialPIs = new Set();

    maxterms.forEach((maxterm, columnIndex) => {
        if (xCounts[columnIndex] === 1) {
            const rowIndex = xMap.findIndex(row => row[columnIndex]);
            if (rowIndex !== -1) {
                const primeImplicant = primeImplicantsList[rowIndex];
                essentialPrimeImplicants.add(primeImplicant);
    
                const maxtermGroup = String(maxtermsList[rowIndex]);
                const terms = maxtermGroup.includes('-') ? maxtermGroup.split('-').map(Number) : [Number(maxtermGroup)];
    
                terms.forEach(term => maxtermsCoveredByEssentialPIs.add(term));
            }
        }
    });    

    /**
     * Build table rows to show prime implicants and X marks for covered maxterms
     * 1. Mark rows containing essential prime implicants as true in isEssentialRow using essentialPrimeImplicants set and primeImplicantsList
     * 2. Mark X marks in xMap and has xCounts = 1. Set their classname as essential to color them purple
     * 3. Mark other X marks in the same row of X mark in 2. Set their classname as essentialFriend to color them black
     * 4. Put X in all cells marked as X in xMap
     */
    const tableRows = xMap.map((maxtermCoverage, rowIndex) => {
        const isEssentialRow = essentialPrimeImplicants.has(primeImplicantsList[rowIndex]);
    
        return (
            <div key={rowIndex} className="tableRow">
                <div className="primeImplicantEntries">{primeImplicantsList[rowIndex]}</div>
                <div className="maxtermEntries">{maxtermsList[rowIndex]}</div>

                {maxtermCoverage.map((isMarkedX, columnIndex) => {
                    const isEssentialX = isMarkedX && xCounts[columnIndex] === 1;
                    const className = isEssentialX ? 'essential' : isEssentialRow && isMarkedX ? 'essentialFriend' : '';
    
                    return (
                        <div key={columnIndex} className={`xEntries ${className}`}>
                            {isMarkedX ? 'X' : ''}
                        </div>
                    );
                })}
            </div>
        );
    });

    /**
     * Greedy algorithm to select needed non-essential prime implicants
     * 
     * 1. Get prime implicant from primeImplicantsList
     * 2.1 If already contained in essentialPrimeImplicants or neededPrimeImplicants, skip to next prime implicant.
     * 2.2 If not, store uncovered maxterms it covers in currentlyCovered
     * 3.1 If currentlyCovered > mostCoveredMaxterms, set primeImplicant as neededPrimeImplicant and currentlyCovered as mostCoveredMaxterms
     * 3.2 If not, skip to next prime implicant
     * 4. Once all prime implicants are checked, store neededPrimeImplicant in neededNonessentialPrimeImplicants
     * 5. Remove maxterms in mostCoveredTerms from uncoveredMaxterms
     * 6. Repeat until size of uncoveredMaxterms is 0.
     */
    const neededNonessentialPrimeImplicants = new Set();
    const maxtermsCoveredByNeededNonessentialPIs = new Set();
    let uncoveredMaxterms = maxterms.filter(maxterm => !maxtermsCoveredByEssentialPIs.has(maxterm));

    function findNeededPrimeImplicant(currentUncovered) {
        let neededPrimeImplicant = null;
        let mostCoveredMaxterms = [];

        for (let index = 0; index < primeImplicantsList.length; index++) {
            const primeImplicant = primeImplicantsList[index];

            if (essentialPrimeImplicants.has(primeImplicant) || neededNonessentialPrimeImplicants.has(primeImplicant)) continue;

            const maxtermGroup = String(maxtermsList[index]);
            const currentlyCovered = maxtermGroup.includes('-')
                ? maxtermGroup.split('-').map(Number).filter(maxterm => currentUncovered.includes(maxterm))
                : [Number(maxtermGroup)].filter(maxterm => currentUncovered.includes(maxterm));

            if (currentlyCovered.length > mostCoveredMaxterms.length) {
                neededPrimeImplicant = primeImplicant;
                mostCoveredMaxterms = currentlyCovered;
            }
        }

        return { neededPrimeImplicant, mostCoveredMaxterms };
    }

    while (uncoveredMaxterms.length > 0) {
        const { neededPrimeImplicant, mostCoveredMaxterms } = findNeededPrimeImplicant(uncoveredMaxterms);

        neededNonessentialPrimeImplicants.add(neededPrimeImplicant);
        mostCoveredMaxterms.forEach(maxterm => maxtermsCoveredByNeededNonessentialPIs.add(maxterm));
        uncoveredMaxterms = uncoveredMaxterms.filter(maxterm => !mostCoveredMaxterms.includes(maxterm));
    }

     /**
      * Creates a row showing a checkmark icon for each maxterm:
      * ✔️ - covered by essential PI
      * ➖ - covered by needed non-essential PI
      * ❌ - not yet covered
      */
    const checkRow = (
        <div className="checkRow">
            <div className="primeImplicantEntries"></div>
            <div className="maxtermEntries"></div>
            {maxterms.map((maxterm, columnIndex) => {
                const isCoveredByEssential = maxtermsCoveredByEssentialPIs.has(maxterm);
                const isCoveredByNonEssential = maxtermsCoveredByNeededNonessentialPIs.has(maxterm);

                return (
                    <div key={columnIndex} className={`checkEntries ${isCoveredByEssential ? 'essentialCheck' : 'nonEssentialCheck'}`}>
                        {isCoveredByEssential ? '✔️' : (isCoveredByNonEssential ? '➖' : '❌')}
                    </div>
                );
            })}
        </div>
    );

    /**
     * Call to push data to App.js for POS.js to use
     */
    const essentialArray = Array.from(essentialPrimeImplicants);
    const neededNonessentialArray = Array.from(neededNonessentialPrimeImplicants);

    useEffect(() => {
        setEssentialPrimeImplicants(essentialArray);
        setNeededNonessentialPrimeImplicants(neededNonessentialArray);
    }, [essentialArray, neededNonessentialArray, setEssentialPrimeImplicants, setNeededNonessentialPrimeImplicants]);    

    return (
        <div>
            {/**  
             * All possible minterms are covered causing both sets to be empty.
             * Therefore, there is no need for the table because the answer is already 1
            */}
            {(essentialPrimeImplicants.size === 0 && neededNonessentialPrimeImplicants.size === 0) ? (
                <h1>All minterms are found in expression therefore, <br/>there is no need for this table. Proceed to next tab for final answer.</h1>) : (
                <>
                    <div className="tableContainer">
                        <div className="table">
                            {checkRow}
                            <div className="tableHeader">
                                <div className="primeImplicantEntries">Prime Implicants</div>
                                <div className="maxtermEntries">Maxterms</div>
                                {maxtermColumns}
                            </div>
                            {tableRows}
                        </div>
                    </div>

                    <div className="primeImplicantsDisplay">
                        <p>
                            {essentialPrimeImplicants.size === 0 ? (<span></span>) : (
                                <>
                                    <b>Essential Prime Implicants:</b><br />
                                    {Array.from(essentialPrimeImplicants).join(', ')}
                                </>
                            )}
                        </p>
                        <p>
                            {neededNonessentialPrimeImplicants.size === 0 ? (<span></span>) : (
                                <>
                                    <b>Needed Nonessential Prime Implicants:</b><br />
                                    {Array.from(neededNonessentialPrimeImplicants).join(', ')}
                                </>
                            )}
                        </p>
                        <br />
                        <small>
                            {neededNonessentialPrimeImplicants.size === 0 ? (<span></span>) : (
                                <>
                                    Note: Needed Non-Essential Prime Implicants are chosen by taking the nonessential prime implicant <br />
                                    that covers the most number of maxterms until all maxterms are covered
                                </>
                            )}
                        </small>
                    </div>
                    <div className="legendContainer">
                        <h3>LEGEND FOR TABLE <br /></h3>
                        <div className="legends">
                            <div>
                                ✔️ - maxterm covered by essential prime implicant <br />
                                ➖ - maxterm covered by nonessential prime implicant <br />
                                ❌ - maxterm covered by neither of the two <br />
                            </div>
                            <div>
                                <span className="essentialDot">⬤</span> - X entry alone in column<br />
                                <span className="essentialFriendDot">⬤</span> - X entry in the same row as purple X
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PrimeImplicantTable;