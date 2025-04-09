import React, { useState } from 'react';
import './App.css';
import Input from './components/Input.js';
import Pairwise from './components/Pairwise.js';
import Table from './components/Table.js';
import POS from './components/POS.js';

function App() {
    const [activeTab, setActiveTab] = useState('input');
    const[mintermsArray, setMintermsArray] = useState(""); 
    const[variablesArray, setVariablesArray] = useState(""); 

    const renderContent = () => {
        switch (activeTab) {
            case 'input':
                return <Input setActiveTab={setActiveTab} setMintermsArray={setMintermsArray} setVariablesArray={setVariablesArray}/>;
            case 'pairwise':
                return <Pairwise mintermsArray={mintermsArray} variablesArray={variablesArray}/>;
            case 'primeImplicantTable':
                return <Table />;
            case 'finalExpressions':
                return <POS />;
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
                    className={`tab ${activeTab === 'pairwise' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('pairwise')}
                >
                    Pairwise Simplification
                </div>
                <div 
                    className={`tab ${activeTab === 'primeImplicantTable' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('primeImplicantTable')}
                >
                    Prime Implicant Table
                </div>
                <div 
                    className={`tab ${activeTab === 'finalExpressions' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('finalExpressions')}
                >
                    Final Minimized Expressions
                </div>
            </div>
            <div className="App-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;
