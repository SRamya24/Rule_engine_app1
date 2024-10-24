const Rule = require('../models/Rule');
const { parseRuleString, combineNodes, evaluate, printTree } = require('../utils/ast');

exports.createRule = async (req, res) => {
  try {
    const { ruleName, ruleString, createdBy } = req.body;
    if (!ruleName || !ruleString) {
      return res.status(400).json({ error: 'ruleName and ruleString are required' });
    }
    const rootNode = parseRuleString(ruleString);
    const rule = new Rule({ ruleName, ruleAST: rootNode, createdBy });
    await rule.save();
    printTree(rootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.combineRules = async (req, res) => {
  try {
    const { rules, op } = req.body;
    const ruleDocs = await Rule.find({ ruleName: { $in: rules } });
    if (ruleDocs.length === 0) {
      return res.status(404).json({ error: 'No matching rules found' });
    }
    const ruleASTs = ruleDocs.map(rule => rule.ruleAST);
    const combinedRootNode = combineNodes(ruleASTs, op);
    const rule = new Rule({ ruleName: `combined_${new Date().getTime()}`, ruleAST: combinedRootNode });
    await rule.save();
    printTree(combinedRootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.evaluateRule = async (req, res) => {
  try {
    const { ast, data } = req.body;
    const rule = await Rule.findOne({ ruleName: ast });
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    const result = evaluate(rule.ruleAST, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
