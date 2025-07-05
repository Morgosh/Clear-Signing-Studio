import { validateMetadata } from '../../web-interface/src/utils/validateMetadata.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing ERC-7730 Calldata Validator');
console.log('=======================================');

// Test with eip7730Calldata.json
try {
  const calldataPath = path.join(__dirname, '../../examples/seaport/calldata/eip7730Calldata.json');
  const calldataJson = JSON.parse(fs.readFileSync(calldataPath, 'utf8'));
  const data = calldataJson;
  
  
  const result = validateMetadata(data);
  console.log('Result:', result);
} catch (error) {
  console.log('❌ ERROR - Exception was thrown:', error.message);
}