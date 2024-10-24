import React, { useState } from 'react';
import './App.css';

function App() {
  const [ruleName, setRuleName] = useState('');
  const [ruleString, setRuleString] = useState('');
  const [createResult, setCreateResult] = useState('');
  const [combineRules, setCombineRules] = useState([{ rule: '', operator: 'AND' }]);
  const [combineResult, setCombineResult] = useState('');
  const [evaluateAST, setEvaluateAST] = useState('');
  const [evaluateData, setEvaluateData] = useState('');
  const [evaluateResult, setEvaluateResult] = useState('');

  const handleAddRule = () => {
    setCombineRules([...combineRules, { rule: '', operator: 'AND' }]);
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/rules/create_rule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleName, ruleString, createdBy: 'Ramya' })
    });
    const result = await response.json();
    setCreateResult(JSON.stringify(result, null, 2));
  };

  const handleCombineRules = async (e) => {
    e.preventDefault();
    const rules = combineRules.map(rule => rule.rule);
    const response = await fetch('/api/rules/combine_rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules, op: 'AND' }) // You can handle operators per rule.
    });
    const result = await response.json();
    setCombineResult(JSON.stringify(result, null, 2));
  };

  const handleEvaluateRule = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/rules/evaluate_rule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ast: evaluateAST, data: JSON.parse(evaluateData) })
    });
    const result = await response.json();
    setEvaluateResult(JSON.stringify(result, null, 2));
  };

  return (
    <div className="App">
      <h1>Rule Engine</h1>

      {/* Create Rule Form */}
      <form onSubmit={handleCreateRule}>
        <h2>Create Rule</h2>
        <label>Rule Name:</label>
        <input value={ruleName} onChange={(e) => setRuleName(e.target.value)} required />
        <label>Rule String:</label>
        <input value={ruleString} onChange={(e) => setRuleString(e.target.value)} required />
        <button type="submit">Create Rule</button>
      </form>
      <pre>{createResult}</pre>

      {/* Combine Rules Form */}
      <form onSubmit={handleCombineRules}>
        <h2>Combine Rules</h2>
        {combineRules.map((combineRule, index) => (
          <div key={index}>
            <label>Rule {index + 1}:</label>
            <input value={combineRule.rule} onChange={(e) => {
              const newRules = [...combineRules];
              newRules[index].rule = e.target.value;
              setCombineRules(newRules);
            }} required />
          </div>
        ))}
        <button type="button" onClick={handleAddRule}>Add Another Rule</button>
        <button type="submit">Combine Rules</button>
      </form>
      <pre>{combineResult}</pre>

      {/* Evaluate Rule Form */}
      <form onSubmit={handleEvaluateRule}>
        <h2>Evaluate Rule</h2>
        <label>Rule AST:</label>
        <textarea value={evaluateAST} onChange={(e) => setEvaluateAST(e.target.value)} required />
        <label>Data JSON:</label>
        <textarea value={evaluateData} onChange={(e) => setEvaluateData(e.target.value)} required />
        <button type="submit">Evaluate Rule</button>
      </form>
      <pre>{evaluateResult}</pre>
    </div>
  );
}

export default App;
