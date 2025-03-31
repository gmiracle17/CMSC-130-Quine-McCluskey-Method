import React from 'react';
import '../App.css';

function Table() {
    const minterms = 16; 
    const primeImplicants = 5;  
    const columns = []; 

    for (let i = 0; i < minterms; i++) {
        columns.push(
            <div key={i} className = "mintermColumn">
                {i} 
            </div>
        );
    }

    const rows = [];
    for (let j = 0; j < primeImplicants; j++) {
        const row = (
            <div key={j} className="tableRow">
                <div className="primeImplicantEntries">ABCD</div>
                <div className="mintermEntries">1-2-3-4</div>
                {columns.map((column, index) => (
                    <div key={index} className="xEntries">
                        X
                    </div>
                ))}
            </div>
        );
        rows.push(row);
    }


    return (
        <div className = "tableContainer">
            <div className = "tableHeader">
                <div className = "tableColumn">Prime Implicants</div>
                <div className = "tableColumn">Minterms</div>
                {columns}
            </div>
            {rows} 
        </div>
    );
}

export default Table;
