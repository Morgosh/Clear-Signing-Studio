import { validateMetadata } from '../../web-interface/src/utils/validateMetadata.js';
import calldataJson from '../../examples/seaport/calldata/eip7730Calldata.json' assert { type: 'json' };

console.log('🧪 Testing ERC-7730 Calldata Validator');
console.log('=======================================');

// Test with eip7730Calldata.json
try {
  const data = calldataJson;
  
  
  
  const result = validateMetadata(data);
  console.log('Result:', result);
} catch (error) {
  console.log('❌ ERROR - Exception was thrown:', error.message);
}