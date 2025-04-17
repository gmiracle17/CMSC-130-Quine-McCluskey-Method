import React from 'react';
import '../App.css';

/**
 * Table Component that visualizes prime implicants and maxterms
 *
 * @param variables - list of Boolean variables (e.g. ['A', 'B', 'C']) retrieved from Input.js
 * @param minterms - list of minterms (e.g. [1, 4, 5]) retrieved from Input.js
 * @param maxtermsList - list of maxterm groups (e.g. ["2-6-10", "3-7-11"]) retrieved from Pairwise.js
 * @param binaryList - list of binary strings (e.g. ["010_", "_110"]) retrieved from Pairwise.js
 * @return PrimeImplicantTable - table visualizing prime implicants, coverage of maxterms, and essential/needed non-essential prime implicants
 * 
 */

function PrimeImplicantTable({ variables, minterms, maxtermsList, binaryList }) {
    /**
     * Generate primeImplicantsList - list of prime implicants from the binary representation
     */
    const primeImplicantsList = binaryList.map(binary =>
        binary.split('').map((bit, i) =>
            bit === '0' ? variables[i] + "'" :
            bit === '1' ? variables[i] : ''
        ).join('')
    );

    /**
     * Generate maxterms - list of maxterms (terms not in minterms) by creating array of all terms from 0 to 2^n-1
     * and excluding terms that are in minterms
     */
    const totalTerms = 2 ** variables.length; // maxterms + minterms
    const maxterms = Array.from({ length: totalTerms }, (_, index) => index).filter(index => !minterms.includes(index));


    /**
     * Maxterm Column headers for the table based on maxterms
     */
    const maxtermColumns = maxterms.map((maxterm, i) => (
        <div key={i} className="maxtermColumn">{maxterm}</div>
    ));

    /**
     * Generate xMap - maps prime implicants to the maxterms they cover
     */
    const xMap = maxtermsList.map(maxtermPair => {
        const coveredTerms = maxtermPair.split('-').map(Number);
        return maxterms.map(maxterm => coveredTerms.includes(maxterm));
    });

    /**
     * Generate xCounts - maps count of prime implicants that cover each maxterm
     */
    const xCounts = maxterms.map((_, maxtermColumns) =>
        xMap.reduce((count, row) => count + (row[maxtermColumns] ? 1 : 0), 0)
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

                maxtermsList[rowIndex].split('-').map(Number).forEach(term => maxtermsCoveredByEssentialPIs.add(term));
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
                <div className="space" />
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

            const currentlyCovered = maxtermsList[index].split('-').map(Number).filter(maxterm => currentUncovered.includes(maxterm));

            if (currentlyCovered.length > mostCoveredMaxterms.length) {
                neededPrimeImplicant = primeImplicant;
                mostCoveredMaxterms = currentlyCovered;
            }
        }

        return { neededPrimeImplicant, mostCoveredMaxterms };
    }

    while (uncoveredMaxterms.length > 0) {
        const { neededPrimeImplicant, mostCoveredMaxterms } = findNeededPrimeImplicant(uncoveredMaxterms);

        if (!neededPrimeImplicant) {
            console.warn('Unable to cover all maxterms!');
            break;
        }

        neededNonessentialPrimeImplicants.add(neededPrimeImplicant);
        mostCoveredMaxterms.forEach(maxterm => maxtermsCoveredByNeededNonessentialPIs.add(maxterm));
        uncoveredMaxterms = uncoveredMaxterms.filter(maxterm => !mostCoveredMaxterms.includes(maxterm));
    }

     /**
     * Final row that shows checkmarks for essential ☑️/ needed non-essential ✅ prime implicant coverage
     */
    const checkRow = (
        <div className="tableRow">
            <div className="primeImplicantEntries"></div>
            <div className="maxtermEntries"></div>
            {maxterms.map((maxterm, columnIndex) => {
                const isCoveredByEssential = maxtermsCoveredByEssentialPIs.has(maxterm);
                const isCoveredByNonEssential = maxtermsCoveredByNeededNonessentialPIs.has(maxterm);

                return (
                    <div key={columnIndex} className={`xEntries ${isCoveredByEssential ? 'essentialCheck' : 'nonEssentialCheck'}`}>
                        {isCoveredByEssential ? '☑️' : (isCoveredByNonEssential ? '✅' : '')}
                    </div>
                );
            })}
            <div className="space" />
        </div>
    );

    return (
        <div>
            <div className="tableContainer">
                <div className="tableHeader">
                    <div class="primeImplicantEntries" id="header">Prime Implicants</div>
                    <div class="maxtermEntries" id="header">Maxterms</div>
                    {maxtermColumns}
                </div>
                {tableRows}
                {checkRow}
            </div>
            <div className="essentialPrimeImplicants">
                <p><b>Essential Prime Implicants:</b><br />
                    {essentialPrimeImplicants.length === 0 ? (<span>None</span>) : (Array.from(essentialPrimeImplicants).join(', '))}</p>
                <p><b>Needed Non-Essential Prime Implicants:</b><br />
                    {neededNonessentialPrimeImplicants.size === 0 ? (<span>None</span>) : (Array.from(neededNonessentialPrimeImplicants).join(', '))}</p>
            </div>
        </div>
    );
}

export default PrimeImplicantTable;
