/* just in case mawala ko, pati i will clean it tom, pacheck nalang logics
note: maxterms ginamit kong term kasi uhhhhh idk it just feels better, but baka ibalik ko sa minterms when we're cleaning this
un commments pinagenerate ko kasi nakalimutan ko na which is which by the time i ended sorry and yea idk na rin,,, wala pa tong error handling tbf
too sleepy
*/
import React from 'react';
import '../App.css';

function Table({ variables, minterms, maxtermsList, binaryList }) {
    // Generate prime implicants
    const primeImplicantsList = binaryList.map(binary =>
        binary.split('').map((bit, i) =>
            bit === '0' ? variables[i] + "'" :
            bit === '1' ? variables[i] : ''
        ).join('')
    );

    // Determine maxterms (complement of minterms)
    const maxterms = Array.from({ length: 2 ** variables.length }, (_, i) =>
        !minterms.includes(i) ? i : null
    ).filter(x => x !== null);

    // Create maxterm columns
    const columns = maxterms.map((term, i) => (
        <div key={i} className="mintermColumn">{term}</div>
    ));

    // Init map to track "X" positions
    const xMap = maxtermsList.map((groupStr, rowIndex) => {
        const groupMaxterms = groupStr.split('-').map(Number);
        return maxterms.map(mt => groupMaxterms.includes(mt));
    });

    // Count coverage of each maxterm
    const xCounts = maxterms.map((mt, colIndex) =>
        xMap.reduce((count, row) => count + (row[colIndex] ? 1 : 0), 0)
    );

    // Sets to store implicants
    const essentialPrimeImplicantsSet = new Set();
    const essentialCoveredMaxterms = new Set();

    // Find essential implicants (those that uniquely cover a maxterm)
    maxterms.forEach((mt, colIndex) => {
        if (xCounts[colIndex] === 1) {
            const rowIndex = xMap.findIndex(row => row[colIndex]);
            if (rowIndex !== -1) {
                essentialPrimeImplicantsSet.add(primeImplicantsList[rowIndex]);
                const groupMaxterms = maxtermsList[rowIndex].split('-').map(Number);
                groupMaxterms.forEach(t => essentialCoveredMaxterms.add(t));
            }
        }
    });

    // Build table rows
    const tableRows = maxtermsList.map((groupStr, rowIndex) => {
        const groupMaxterms = groupStr.split('-').map(Number);
        return (
            <div key={rowIndex} className="tableRow">
                <div className="primeImplicantEntries">{primeImplicantsList[rowIndex]}</div>
                <div className="mintermEntries">{groupStr}</div>
                {maxterms.map((mt, colIndex) => {
                    const isX = groupMaxterms.includes(mt);
                    const isEssential = isX && xCounts[colIndex] === 1;
                    return (
                        <div key={colIndex} className={`xEntries ${isEssential ? 'essential' : ''}`}>
                            {isX ? 'X' : ''}
                        </div>
                    );
                })}
            </div>
        );
    });

    /* Greedy Algo na gawa gawa ko lang but idk if it is best; Getting needed non-essential prime implicants
    1. Retrieve uncovered maxterms (maxterms that are not in any essential prime implicant)
    2. Search nonessential prime implicant (not in any set only in list for now) that covers the most number of uncovered maxterms
    3. Remove maxterms in this prime implicant from the uncovered maxterms
    4. Repeat 1-3 until uncovered maxterms has no more elements
    */
    let uncoveredMaxterms = maxterms.filter(mt => !essentialCoveredMaxterms.has(mt));

    const nonEssentialPrimeImplicantsSet = new Set();

    while (uncoveredMaxterms.length > 0) {
        let bestPIIndex = -1;
        let bestCoverage = [];

        for (let i = 0; i < primeImplicantsList.length; i++) {
            const pi = primeImplicantsList[i];
            if (essentialPrimeImplicantsSet.has(pi) || nonEssentialPrimeImplicantsSet.has(pi)) continue;

            const terms = maxtermsList[i].split('-').map(Number);
            const coverage = terms.filter(mt => uncoveredMaxterms.includes(mt));

            if (coverage.length > bestCoverage.length) {
                bestCoverage = coverage;
                bestPIIndex = i;
            }
        }

        // Add the best PI and mark its terms as covered
        const selectedPI = primeImplicantsList[bestPIIndex];
        nonEssentialPrimeImplicantsSet.add(selectedPI);
        uncoveredMaxterms = uncoveredMaxterms.filter(mt => !bestCoverage.includes(mt));
    }

    // Bottom indicator row — checkmark shows who covered what
    const essentialRowIndicators = (
        <div className="tableRow">
            <div className="primeImplicantEntries"></div>
            <div className="mintermEntries"></div>
            {maxterms.map((mt, i) => {
                const isEssential = essentialCoveredMaxterms.has(mt);
                // Check if maxterm is covered by any non-essential prime implicant
                const isCoveredByNonEssential = Array.from(nonEssentialPrimeImplicantsSet).some(pi => {
                    const terms = maxtermsList[primeImplicantsList.indexOf(pi)].split('-').map(Number);
                    return terms.includes(mt);
                });
                return (
                    <div key={i} className={`xEntries ${isEssential ? 'essentialCheck' : 'nonEssentialCheck'}`}>
                        {isEssential ? '☑️' : (isCoveredByNonEssential ? '✅' : '')}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableColumn">Prime Implicants</div>
                <div className="tableColumn">Maxterms</div>
                {columns}
            </div>

            {tableRows}
            {essentialRowIndicators}

            <div className="essentialPrimeImplicants">
                <p><strong>Essential Prime Implicants:</strong><br />
                    {Array.from(essentialPrimeImplicantsSet).join(', ')}</p>
                <p><strong>Non-Essential Prime Implicants:</strong><br />
                    {Array.from(nonEssentialPrimeImplicantsSet).join(', ')}</p>
            </div>
        </div>
    );
}

export default Table;
