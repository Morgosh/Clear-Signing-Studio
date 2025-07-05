import { validateMetadata } from '../../web-interface/src/utils/validateMetadata.js';
import eip712Json from '../../examples/seaport/eip712/eip7730osea1.6.json' assert { type: 'json' };

console.log('🧪 Testing ERC-7730 EIP712 Validator');
console.log('=====================================');

// Test with eip7730osea1.6.json
try {
  const data = eip712Json;
  const result = validateMetadata(data);
  console.log('Result:', result);
} catch (error) {
  console.log('❌ ERROR - Exception was thrown:', error.message);
}