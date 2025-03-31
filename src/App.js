import React, { useState } from 'react';
import './App.css';
import Input from './components/Input.js';
import Pairwise from './components/Pairwise.js'; // Assuming you have a Pairwise component
import Table from './components/Table.js'; // Assuming you have this component
import POS from './components/POS.js'; // Assuming you have this component

function App() {
    const [activeTab, setActiveTab] = useState('input');

    const renderContent = () => {
        switch (activeTab) {
            case 'input':
                return <Input />;
            case 'pairwise':
                return <Pairwise />;
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
