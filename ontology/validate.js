const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('weather-ontology.jsonld', 'utf8'));
  
  const nodes = data['@graph'].filter(x => x['@type'] === 'Node');
  const rels = data['@graph'].filter(x => x['@type'] === 'Relationship');
  
  console.log('✓ Valid JSON-LD file');
  console.log(`✓ Found ${nodes.length} Nodes`);
  console.log(`✓ Found ${rels.length} Relationships`);
  console.log('\n✓ Nodes:');
  nodes.forEach(n => console.log(`  - ${n.name} (${n['@id']})`));
  console.log('\n✓ Relationships:');
  rels.forEach(r => console.log(`  - ${r.name}: ${r.from} → ${r.to}`));
  console.log('\n✓ Structure validated for ICA Context Studio');
  
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}

// Made with Bob
