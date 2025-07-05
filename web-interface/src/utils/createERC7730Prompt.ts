interface ContractInfo {
  name: string;
  owner: string;
  legalName: string;
  url: string;
  address: string;
  chainId: number;
}

interface ABIInput {
  internalType?: string;
  name?: string;
  type: string;
  components?: ABIInput[];
}

interface ABIOutput {
  internalType?: string;
  name?: string;
  type: string;
}

interface ABI {
  inputs?: ABIInput[];
  name?: string;
  outputs?: ABIOutput[];
  stateMutability?: string;
  type?: string;
}

interface PromptPayload {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature: number;
  stream: boolean;
  max_tokens: number;
}

/**
 * Creates a structured prompt for ERC-7730 metadata generation
 * @param contractInfo - Contract information
 * @param abi - Contract ABI function
 * @param additionalInstructions - Additional specific instructions
 * @returns Formatted payload for ASI API
 */
export function createERC7730Prompt(contractInfo: ContractInfo, abi: ABI, additionalInstructions: string = ''): PromptPayload {
  const systemPrompt = `You are an ERC-7730 metadata generator. ERC-7730 is a standard for describing smart contract transaction intents in a user-friendly way.

Here are two examples of proper ERC-7730 structure:

**Example 1: Contract Calldata (ERC20)**
{
  "$schema": "../specs/erc7730-v1.schema.json",
  "context": {
    "contract": {
      "abi": [
        {
          "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "transfer",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "deployments": [
        {"chainId": 1, "address": "0xA0b86a33E6441d6F71c2F6d8b0A8f6A7f8d6e7c5"}
      ]
    }
  },
  "metadata": {
    "owner": "Example Token Team",
    "info": {
      "legalName": "Example Token Foundation",
      "url": "https://example-token.com"
    }
  },
  "display": {
    "formats": {
      "transfer(address to,uint256 amount)": {
        "intent": "Transfer Tokens",
        "fields": [
          {
            "path": "#.to",
            "label": "Recipient",
            "format": "addressName",
            "params": {"types": ["wallet", "eoa", "contract"]}
          },
          {
            "path": "#.amount",
            "label": "Amount",
            "format": "tokenAmount",
            "params": {"tokenPath": "@.to"}
          }
        ]
      }
    }
  }
}

**Example 2: EIP712 Signature (Uniswap)**
{
  "$schema": "../specs/erc7730-v1.schema.json",
  "context": {
    "eip712": {
      "deployments": [
        {"chainId": 1, "address": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"}
      ],
      "domain": {
        "name": "Uniswap V3",
        "version": "1.0",
        "chainId": 1,
        "verifyingContract": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
      },
      "schemas": [
        {
          "primaryType": "SwapOrder",
          "types": {
            "EIP712Domain": [
              {"name": "name", "type": "string"},
              {"name": "version", "type": "string"},
              {"name": "chainId", "type": "uint256"},
              {"name": "verifyingContract", "type": "address"}
            ],
            "SwapOrder": [
              {"name": "tokenIn", "type": "address"},
              {"name": "tokenOut", "type": "address"},
              {"name": "amountIn", "type": "uint256"},
              {"name": "amountOutMinimum", "type": "uint256"},
              {"name": "deadline", "type": "uint256"},
              {"name": "recipient", "type": "address"}
            ]
          }
        }
      ]
    }
  },
  "metadata": {
    "owner": "Uniswap Labs",
    "info": {
      "legalName": "Uniswap Labs, Inc.",
      "url": "https://uniswap.org"
    }
  },
  "display": {
    "formats": {
      "SwapOrder": {
        "intent": "Swap Tokens on Uniswap V3",
        "fields": [
          {
            "path": "tokenIn",
            "label": "Input Token",
            "format": "addressName",
            "params": {"types": ["contract", "token"]}
          },
          {
            "path": "amountIn",
            "label": "Amount In",
            "format": "tokenAmount",
            "params": {"tokenPath": "tokenIn"}
          }
        ]
      }
    }
  }
}

Key rules:
- Use "#." for calldata parameters (contract context)
- Use direct field names for EIP712 data
- Include proper format types: "addressName", "tokenAmount", "timestamp", etc.
- Always include meaningful "intent" descriptions
- Use "excluded" array for technical fields users don't need to see`;

  const userPrompt = `Generate ERC-7730 metadata for ${contractInfo.name} with the following details:

**Contract Info:**
- Name: ${contractInfo.name}
- Owner: ${contractInfo.owner}
- Legal Name: ${contractInfo.legalName}
- URL: ${contractInfo.url}
- Address: ${contractInfo.address}
- Chain: ${getChainName(contractInfo.chainId)} (chainId: ${contractInfo.chainId})

**ABI Function:**
${JSON.stringify(abi, null, 2)}

${additionalInstructions}

Please generate the complete ERC-7730 JSON metadata focusing on user-friendly fields and exclude technical fields. Return only the JSON, no explanations.`;

  return {
    model: 'asi1-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0,
    stream: false,
    max_tokens: 1500
  };
}

/**
 * Helper function to get chain name from chain ID
 * @param chainId - Chain ID
 * @returns Chain name
 */
function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    10: 'Optimism',
    56: 'BSC',
    137: 'Polygon',
    250: 'Fantom',
    42161: 'Arbitrum One',
    43114: 'Avalanche'
  };
  return chains[chainId] || `Chain ${chainId}`;
}

/**
 * Creates a simple prompt for basic ERC-7730 generation
 * @param contractAddress - Contract address
 * @param contractName - Contract name
 * @returns Formatted payload for ASI API
 */
export function createSimpleERC7730Prompt(contractAddress: string, contractName: string): PromptPayload {
  return {
    model: 'asi1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an ERC-7730 metadata generator. Generate valid ERC-7730 JSON metadata for smart contracts.'
      },
      {
        role: 'user',
        content: `Generate ERC-7730 metadata for contract ${contractAddress} named ${contractName}. Return only valid JSON.`
      }
    ],
    temperature: 0,
    stream: false,
    max_tokens: 1000
  };
} 