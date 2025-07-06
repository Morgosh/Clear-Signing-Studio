import { validateMetadata } from './src/utils/validateMetadata.js';

console.log('📚 ERC-7730 Validator Usage Examples');
console.log('====================================');

// Example 1: Validating contract metadata from your agent
console.log('\n🤖 Example 1: Contract metadata (from your agent)');
const contractMetadata = {
  context: {
    contract: {
      address: '0xA0b86a33E6441d6F71c2F6d8b0A8f6A7f8d6e7c5',
      chainId: 1,
      name: 'USDC',
      abi: '[]'
    }
  },
  metadata: {
    owner: 'Clear Signing Studio',
    info: {
      legalName: 'USDC',
      lastUpdate: new Date().toISOString(),
      description: 'Smart contract for USDC'
    }
  },
  display: {
    formats: {
      'transfer(address,uint256)': {
        intent: 'Transfer tokens to recipient',
        fields: [
          { path: 'to', label: 'Recipient', format: 'addressName' },
          { path: 'amount', label: 'Amount', format: 'uint256' }
        ]
      }
    }
  }
};

const contractResult = validateMetadata(contractMetadata);
console.log('Contract validation result:', contractResult);

// Example 2: Validating EIP-712 metadata (like OpenSea)
console.log('\n📝 Example 2: EIP-712 metadata (like OpenSea)');
const eip712Metadata = {
  context: {
    eip712: {
      deployments: [
        {
          chainId: 1,
          address: '0x7f268357a8c2552623316e2562d90e642bb538e5'
        }
      ],
      domain: {
        name: 'OpenSea',
        chainId: 1,
        verifyingContract: '0x7f268357a8c2552623316e2562d90e642bb538e5'
      },
      schemas: [
        {
          primaryType: 'Order',
          types: {
            Order: [
              { name: 'exchange', type: 'address' },
              { name: 'maker', type: 'address' },
              { name: 'basePrice', type: 'uint256' },
              { name: 'expirationTime', type: 'uint256' }
            ]
          }
        }
      ]
    }
  },
  metadata: {
    owner: 'OpenSea'
  },
  display: {
    formats: {
      Order: {
        intent: 'OpenSea Listing',
        fields: [
          { path: 'basePrice', label: 'Price', format: 'tokenAmount' },
          { path: 'expirationTime', label: 'Expires', format: 'datetime' }
        ]
      }
    }
  }
};

const eip712Result = validateMetadata(eip712Metadata);
console.log('EIP-712 validation result:', eip712Result);

// Example 3: How to use in your application
console.log('\n💡 Example 3: Usage in your application');
console.log(`
// In your app:
import { validateMetadata } from './src/utils/validateMetadata.js';

// Validate metadata from any source
const result = validateMetadata(someMetadata);

if (result.valid) {
  console.log('✅ Valid ERC-7730 metadata!');
  console.log('Context type:', result.contextType); // 'contract' or 'eip712'
  
  // Safe to use the metadata
  processMetadata(someMetadata);
} else {
  console.log('❌ Invalid metadata:', result.errors);
  console.log('Context type:', result.contextType); // 'contract', 'eip712', or 'unknown'
  
  // Handle validation errors
  handleValidationErrors(result.errors);
}
`);

console.log('\n🎯 Key features:');
console.log('✅ Supports both contract and EIP-712 contexts');
console.log('✅ Returns contextType in result');
console.log('✅ Detailed error information');
console.log('✅ Never throws exceptions');
console.log('✅ Compatible with your agent output'); 