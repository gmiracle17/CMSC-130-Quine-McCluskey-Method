import React, { useState } from 'react';
import './App.css';
import Input from './components/Input.js';
import Pairwise from './components/Pairwise.js';
import PrimeImplicantTable from './components/PrimeImplicantTable.js';
import POS from './components/POS.js';

function App() {
    const [mintermsInput, setMintermsInput] = useState(""); 
    const [variablesInput, setVariablesInput] = useState(""); 
    const [activeTab, setActiveTab] = useState('input');
    const [mintermsArray, setMintermsArray] = useState([]); 
    const [variablesArray, setVariablesArray] = useState([]); 
    const [binaryList, setBinaryList] = useState([]); 
    const [mintermsList, setMintermsList] = useState([]);
    const [essentialPrimeImplicants, setEssentialPrimeImplicants] = useState([]);
    const [neededNonessentialPrimeImplicants, setNeededNonessentialPrimeImplicants] = useState([]);

    const inputsAreValid = mintermsInput.trim() !== "" && variablesInput.trim() !== "";

    const renderContent = () => {
        switch (activeTab) {
            case 'input':
                return <Input 
                    setActiveTab={setActiveTab} 
                    mintermsInput={mintermsInput} 
                    variablesInput={variablesInput} 
                    setMintermsInput={setMintermsInput}
                    setVariablesInput={setVariablesInput}
                    setMintermsArray={setMintermsArray} 
                    setVariablesArray={setVariablesArray}
                />;
            case 'pairwise':
                return inputsAreValid ? (
                    <Pairwise
                        mintermsInput={mintermsInput}
                        variablesInput={variablesInput} 
                        mintermsArray={mintermsArray} 
                        variablesArray={variablesArray} 
                        setBinaryList={setBinaryList} 
                        setMintermsList={setMintermsList}
                    />
                ) : null; // Render nothing if inputs are not valid
            case 'primeImplicantTable':
                return inputsAreValid ? (
                    <PrimeImplicantTable     
                        minterms={mintermsArray} 
                        variables={variablesArray}
                        maxtermsList={mintermsList}
                        binaryList={binaryList}
                        setEssentialPrimeImplicants={setEssentialPrimeImplicants}
                        setNeededNonessentialPrimeImplicants={setNeededNonessentialPrimeImplicants}
                    />
                ) : null; // Render nothing if inputs are not valid
            case 'finalExpressions':
                return inputsAreValid ? (
                    <POS 
                        minterms={mintermsArray} 
                        variables={variablesArray}
                        essentialPrimeImplicants={essentialPrimeImplicants}
                        neededNonessentialPrimeImplicants={neededNonessentialPrimeImplicants}
                    />
                ) : null; // Render nothing if inputs are not valid
            default:
                return <Input />;
        }
    };

    return (
        <div className="App">
            <div className="App-header">
                Quine-McCluskey Method Solver
            </div>
            <div className="App-tabs">
                <div 
                    className={`tab ${activeTab === 'input' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('input')}
                >
                    Input Minterms and Variables
                </div>
                <div 
                    className={`tab ${activeTab === 'pairwise' ? 'active' : ''} ${!inputsAreValid ? 'disabled' : ''}`} 
                    onClick={() => inputsAreValid && setActiveTab('pairwise')}
                >
                    Pairwise Simplification
                </div>
                <div 
                    className={`tab ${activeTab === 'primeImplicantTable' ? 'active' : ''} ${!inputsAreValid ? 'disabled' : ''}`} 
                    onClick={() => inputsAreValid && setActiveTab('primeImplicantTable')}
                >
                    Prime Implicant Table
                </div>
                <div 
                    className={`tab ${activeTab === 'finalExpressions' ? 'active' : ''} ${!inputsAreValid ? 'disabled' : ''}`} 
                    onClick={() => inputsAreValid && setActiveTab('finalExpressions')}
                >
                    Final Minimized Expression
                </div>
            </div>
            <div className="App-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;