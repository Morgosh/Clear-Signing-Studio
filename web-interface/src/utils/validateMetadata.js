import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ 
  strict: false,
  validateSchema: false,
  addUsedSchema: false
});
addFormats(ajv);

// Simplified ERC-7730 schema focusing on core structure
const erc7730CoreSchema = {
  type: 'object',
  properties: {
    $schema: {
      type: 'string',
      format: 'uri-reference'
    },
    includes: {
      type: 'string',
      format: 'uri-reference'
    },
    context: {
      type: 'object',
      oneOf: [
        {
          // Contract context
          properties: {
            contract: {
              type: 'object',
              properties: {
                abi: {
                  oneOf: [
                    { type: 'array' },
                    { type: 'string', format: 'uri-reference' }
                  ]
                },
                deployments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      chainId: { type: 'integer' },
                      address: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' }
                    },
                    required: ['chainId', 'address']
                  }
                },
                addressMatcher: {
                  type: 'string',
                  format: 'uri'
                },
                factory: {
                  type: 'object',
                  properties: {
                    deployments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          chainId: { type: 'integer' },
                          address: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' }
                        },
                        required: ['chainId', 'address']
                      }
                    },
                    deployEvent: { type: 'string' }
                  },
                  required: ['deployments', 'deployEvent']
                }
              }
            }
          },
          required: ['contract']
        },
        {
          // EIP-712 context
          properties: {
            eip712: {
              type: 'object',
              properties: {
                schemas: {
                  oneOf: [
                    { type: 'string', format: 'uri-reference' },
                    {
                      type: 'array',
                      items: {
                        oneOf: [
                          {
                            type: 'object',
                            properties: {
                              primaryType: { type: 'string' },
                              types: {
                                type: 'object',
                                properties: {
                                  EIP712Domain: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      properties: {
                                        name: { type: 'string' },
                                        type: { type: 'string' }
                                      },
                                      required: ['name', 'type']
                                    }
                                  }
                                },
                                additionalProperties: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      name: { type: 'string' },
                                      type: { type: 'string' }
                                    },
                                    required: ['name', 'type']
                                  }
                                },
                                required: ['EIP712Domain']
                              }
                            },
                            required: ['primaryType', 'types']
                          },
                          { type: 'string', format: 'uri-reference' }
                        ]
                      }
                    }
                  ]
                },
                domain: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    version: { type: 'string' },
                    chainId: { type: 'integer' },
                    verifyingContract: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' }
                  }
                },
                domainSeparator: { type: 'string' },
                deployments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      chainId: { type: 'integer' },
                      address: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' }
                    },
                    required: ['chainId', 'address']
                  }
                }
              }
            }
          },
          required: ['eip712']
        }
      ]
    },
    metadata: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        info: {
          type: 'object',
          properties: {
            legalName: { type: 'string' },
            deploymentDate: { type: 'string', format: 'date-time' },
            url: { type: 'string', format: 'uri' },
            detailsUrl: { type: 'string', format: 'uri' }
          }
        },
        token: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            ticker: { type: 'string' },
            decimals: { type: 'integer' }
          },
          required: ['name', 'ticker', 'decimals']
        },
        constants: {
          type: 'object',
          additionalProperties: {
            type: ['string', 'integer', 'number', 'boolean', 'null']
          }
        },
        enums: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                additionalProperties: { type: 'string' }
              }
            ]
          }
        }
      }
    },
    display: {
      type: 'object',
      properties: {
        definitions: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              value: { type: ['string', 'integer', 'number', 'boolean'] },
              label: { type: 'string' },
              format: { type: 'string' }
            },
            required: ['label', 'format']
          }
        },
        formats: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              intent: {
                oneOf: [
                  { type: 'string' },
                  {
                    type: 'object',
                    additionalProperties: { type: 'string' }
                  }
                ]
              },
              fields: {
                type: 'array',
                items: {
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        path: { type: 'string' },
                        value: { type: ['string', 'integer', 'number', 'boolean'] },
                        label: { type: 'string' },
                        format: { type: 'string' },
                        params: { type: 'object' }
                      },
                      required: ['label', 'format']
                    },
                    {
                      type: 'object',
                      properties: {
                        path: { type: 'string' },
                        fields: {
                          type: 'array',
                          items: { type: 'object' }
                        }
                      },
                      required: ['fields']
                    },
                    {
                      type: 'object',
                      properties: {
                        '$ref': { type: 'string' },
                        params: { type: 'object' }
                      },
                      required: ['$ref']
                    }
                  ]
                }
              },
              required: {
                type: 'array',
                items: { type: 'string' }
              },
              excluded: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['intent', 'fields']
          }
        }
      },
      required: ['formats']
    }
  },
  required: ['context', 'display']
};

// Compile the simplified schema
const validateERC7730 = ajv.compile(erc7730CoreSchema);

function validateMetadata(metadata) {
  // Use the simplified ERC-7730 schema for validation
  const valid = validateERC7730(metadata);
  
  if (!valid) {
    // Determine context type from the metadata for better error reporting
    let contextType = 'unknown';
    if (metadata.context?.contract) {
      contextType = 'contract';
    } else if (metadata.context?.eip712) {
      contextType = 'eip712';
    }
    
    return {
      valid: false,
      errors: validateERC7730.errors,
      contextType: contextType
    };
  }
  
  // Determine context type for successful validation
  let contextType = 'unknown';
  if (metadata.context?.contract) {
    contextType = 'contract';
  } else if (metadata.context?.eip712) {
    contextType = 'eip712';
  }
  
  return {
    valid: true,
    errors: [],
    contextType: contextType
  };
}

// Test function for contract context
function testContractValidation() {
  const contractMetadata = {
    context: {
      contract: {
        deployments: [
          {
            chainId: 1,
            address: '0x1234567890123456789012345678901234567890'
          }
        ]
      }
    },
    metadata: {
      owner: 'Test Owner',
      info: {
        legalName: 'Test Contract',
        url: 'https://example.com'
      }
    },
    display: {
      formats: {
        'transfer(address,uint256)': {
          intent: 'Transfer tokens',
          fields: [
            { path: 'to', label: 'Recipient', format: 'raw' },
            { path: 'amount', label: 'Amount', format: 'raw' }
          ]
        }
      }
    }
  };
  
  return validateMetadata(contractMetadata);
}

// Test function for EIP-712 context
function testEIP712Validation() {
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
              EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' }
              ],
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
      owner: 'OpenSea',
      info: {
        legalName: 'OpenSea Inc.',
        url: 'https://opensea.io'
      }
    },
    display: {
      formats: {
        Order: {
          intent: 'OpenSea Listing',
          fields: [
            { path: 'basePrice', label: 'Price', format: 'raw' },
            { path: 'expirationTime', label: 'Expires', format: 'raw' }
          ]
        }
      }
    }
  };
  
  return validateMetadata(eip712Metadata);
}

export { validateMetadata, testContractValidation, testEIP712Validation };
export default validateMetadata; 