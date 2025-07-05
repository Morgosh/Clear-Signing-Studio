import { validateMetadata } from './src/utils/validateMetadata.js';

console.log('🧪 Testing');
console.log('================================');


// Test 2: Invalid metadata (this should NOT throw)

try {
  const data = {
    "$schema": "../../specs/erc7730-v1.schema.json",
    "context": {
      "contract": {
        "abi": [
          {
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "considerationToken",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "considerationIdentifier",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "considerationAmount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address payable",
                    "name": "offerer",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "zone",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "offerToken",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "offerIdentifier",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "offerAmount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum BasicOrderType",
                    "name": "basicOrderType",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "zoneHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "salt",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "offererConduitKey",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "fulfillerConduitKey",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalOriginalAdditionalRecipients",
                    "type": "uint256"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                      },
                      {
                        "internalType": "address payable",
                        "name": "recipient",
                        "type": "address"
                      }
                    ],
                    "internalType": "struct AdditionalRecipient[]",
                    "name": "additionalRecipients",
                    "type": "tuple[]"
                  },
                  {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                  }
                ],
                "internalType": "struct BasicOrderParameters",
                "name": "",
                "type": "tuple"
              }
            ],
            "name": "fulfillBasicOrder",
            "outputs": [
              { "internalType": "bool", "name": "fulfilled", "type": "bool" }
            ],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "components": [
                      {
                        "internalType": "address",
                        "name": "offerer",
                        "type": "address"
                      },
                      {
                        "internalType": "address",
                        "name": "zone",
                        "type": "address"
                      },
                      {
                        "components": [
                          {
                            "internalType": "enum ItemType",
                            "name": "itemType",
                            "type": "uint8"
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                          },
                          {
                            "internalType": "uint256",
                            "name": "identifierOrCriteria",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "startAmount",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "endAmount",
                            "type": "uint256"
                          }
                        ],
                        "internalType": "struct OfferItem[]",
                        "name": "offer",
                        "type": "tuple[]"
                      },
                      {
                        "components": [
                          {
                            "internalType": "enum ItemType",
                            "name": "itemType",
                            "type": "uint8"
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                          },
                          {
                            "internalType": "uint256",
                            "name": "identifierOrCriteria",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "startAmount",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "endAmount",
                            "type": "uint256"
                          },
                          {
                            "internalType": "address payable",
                            "name": "recipient",
                            "type": "address"
                          }
                        ],
                        "internalType": "struct ConsiderationItem[]",
                        "name": "consideration",
                        "type": "tuple[]"
                      },
                      {
                        "internalType": "enum OrderType",
                        "name": "orderType",
                        "type": "uint8"
                      },
                      {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                      },
                      {
                        "internalType": "bytes32",
                        "name": "zoneHash",
                        "type": "bytes32"
                      },
                      {
                        "internalType": "uint256",
                        "name": "salt",
                        "type": "uint256"
                      },
                      {
                        "internalType": "bytes32",
                        "name": "conduitKey",
                        "type": "bytes32"
                      },
                      {
                        "internalType": "uint256",
                        "name": "totalOriginalConsiderationItems",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct OrderParameters",
                    "name": "parameters",
                    "type": "tuple"
                  },
                  {
                    "internalType": "uint120",
                    "name": "numerator",
                    "type": "uint120"
                  },
                  {
                    "internalType": "uint120",
                    "name": "denominator",
                    "type": "uint120"
                  },
                  {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                  },
                  {
                    "internalType": "bytes",
                    "name": "extraData",
                    "type": "bytes"
                  }
                ],
                "internalType": "struct AdvancedOrder",
                "name": "",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "orderIndex",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum Side",
                    "name": "side",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "identifier",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes32[]",
                    "name": "criteriaProof",
                    "type": "bytes32[]"
                  }
                ],
                "internalType": "struct CriteriaResolver[]",
                "name": "",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes32",
                "name": "fulfillerConduitKey",
                "type": "bytes32"
              },
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
              }
            ],
            "name": "fulfillAdvancedOrder",
            "outputs": [
              { "internalType": "bool", "name": "fulfilled", "type": "bool" }
            ],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        "deployments": [
          {
            "chainId": 1,
            "address": "0x0000000000000068f116a894984e2db1123eb395"
          }
        ]
      }
    },
  
    "metadata": {
      "owner": "OpenSea",
      "info": {
        "legalName": "Ozone Networks, Inc.",
        "url": "https://opensea.io"
      }
    },
  
    "display": {
      "formats": {
        "fulfillBasicOrder(BasicOrderParameters parameters)": {
          "intent": "Buy NFT (Basic Order)",
          "fields": [
            {
              "path": "#.parameters.offerToken",
              "label": "NFT contract",
              "format": "addressName"
            },
            {
              "path": "#.parameters.offerIdentifier",
              "label": "Token ID",
              "format": "raw"
            },
            {
              "path": "#.parameters.considerationToken",
              "label": "Payment token",
              "format": "addressName"
            },
            {
              "path": "#.parameters.considerationAmount",
              "label": "Price",
              "format": "tokenAmount",
              "params": { "tokenPath": "#.parameters.considerationToken" }
            },
            {
              "path": "#.parameters.offerer",
              "label": "Seller",
              "format": "addressName"
            }
          ],
          "excluded": [
            "#.parameters.considerationIdentifier",
            "#.parameters.offerAmount",
            "#.parameters.basicOrderType",
            "#.parameters.startTime",
            "#.parameters.endTime",
            "#.parameters.zone",
            "#.parameters.zoneHash",
            "#.parameters.salt",
            "#.parameters.offererConduitKey",
            "#.parameters.fulfillerConduitKey",
            "#.parameters.totalOriginalAdditionalRecipients",
            "#.parameters.additionalRecipients",
            "#.parameters.signature"
          ]
        },
  
        "fulfillAdvancedOrder(AdvancedOrder advancedOrder,CriteriaResolver[] criteriaResolvers,bytes32 fulfillerConduitKey,address recipient)": {
          "intent": "Buy/Fill NFT Order",
          "fields": [
            {
              "path": "#.advancedOrder.parameters.offer.[0].token",
              "label": "NFT contract",
              "format": "addressName"
            },
            {
              "path": "#.advancedOrder.parameters.offer.[0].identifierOrCriteria",
              "label": "Token ID / Criteria",
              "format": "raw"
            },
            {
              "path": "#.advancedOrder.parameters.offerer",
              "label": "Seller",
              "format": "addressName"
            },
            {
              "path": "#.recipient",
              "label": "Recipient",
              "format": "addressName"
            }
          ],
          "excluded": [
            "#.advancedOrder.parameters.offer.[0].itemType",
            "#.advancedOrder.parameters.offer.[0].startAmount",
            "#.advancedOrder.parameters.offer.[0].endAmount",
            "#.advancedOrder.parameters.consideration.[0].itemType",
            "#.advancedOrder.parameters.consideration.[0].startAmount",
            "#.advancedOrder.parameters.consideration.[0].endAmount",
            "#.advancedOrder.parameters.consideration.[0].recipient",
            "#.advancedOrder.parameters.consideration.[0].token",
            "#.advancedOrder.parameters.orderType",
            "#.advancedOrder.parameters.startTime",
            "#.advancedOrder.parameters.endTime",
            "#.advancedOrder.parameters.zone",
            "#.advancedOrder.parameters.zoneHash",
            "#.advancedOrder.parameters.salt",
            "#.advancedOrder.parameters.conduitKey",
            "#.advancedOrder.parameters.counter",
            "#.criteriaResolvers",
            "#.fulfillerConduitKey",
            "#.advancedOrder.signature",
            "#.advancedOrder.numerator",
            "#.advancedOrder.denominator",
            "#.advancedOrder.extraData"
          ]
        }
      }
    }
  }
  
  
  const result = validateMetadata(data);
  console.log('Result:', result);
} catch (error) {
  console.log('❌ ERROR - Exception was thrown:', error.message);
}