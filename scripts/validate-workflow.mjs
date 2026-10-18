// Sanity-check an n8n workflow export before importing it.
// Usage: node scripts/validate-workflow.mjs [path/to/workflow.json]
import fs from 'node:fs';

const path = process.argv[2] || 'n8n-agent.json';
const wf = JSON.parse(fs.readFileSync(path, 'utf8'));
const errors = [];
const names = new Set(wf.nodes.map(n => n.name));

if (names.size !== wf.nodes.length) errors.push('Duplicate node names');

// Every connection must point at a real node
for (const [from, outputs] of Object.entries(wf.connections)) {
  if (!names.has(from)) errors.push(`Connection from unknown node "${from}"`);
  for (const branch of outputs.main || []) {
    for (const link of branch || []) {
      if (!names.has(link.node)) errors.push(`"${from}" connects to unknown node "${link.node}"`);
    }
  }
}

for (const node of wf.nodes) {
  const { jsCode } = node.parameters;
  if (jsCode) {
    // n8n runs Code nodes inside an async function, so top-level return/await is fine
    try {
      new Function(`return (async () => {\n${jsCode}\n})`);
    } catch (err) {
      errors.push(`Syntax error in "${node.name}": ${err.message}`);
    }
    if (/ /.test(jsCode)) errors.push(`"${node.name}" contains non-breaking spaces`);
  }

  // Values containing {{ }} are only evaluated when they start with "="
  for (const [key, value] of Object.entries(flatten(node.parameters))) {
    if (typeof value === 'string' && value.includes('{{') && !value.startsWith('=') && key !== 'jsCode') {
      errors.push(`"${node.name}" ${key} uses {{ }} but is not an expression (missing leading "=")`);
    }
  }
}

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

if (errors.length) {
  console.error(`${path}: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`${path}: OK (${wf.nodes.length} nodes)`);
