import { validateMetadata } from '../../web-interface/src/utils/validateMetadata.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing ERC-7730 EIP712 Validator');
console.log('=====================================');

// Test with eip7730osea1.6.json
try {
  const eip712Path = path.join(__dirname, '../../examples/seaport/eip712/eip7730osea1.6.json');
  const eip712Json = JSON.parse(fs.readFileSync(eip712Path, 'utf8'));
  const data = eip712Json;
  const result = validateMetadata(data);
  console.log('Result:', result);
} catch (error) {
  console.log('❌ ERROR - Exception was thrown:', error.message);
}