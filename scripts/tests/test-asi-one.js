import { createERC7730Prompt } from '../../web-interface/src/utils/createERC7730Prompt';

const url = 'https://api.asi1.ai/v1/chat/completions';

// Define contract information
const contractInfo = {
  name: 'OpenSea Seaport',
  owner: 'OpenSea',
  legalName: 'Ozone Networks, Inc.',
  url: 'https://opensea.io',
  address: '0x0000000000000068f116a894984e2db1123eb395',
  chainId: 1
};

// Define the ABI function
const abi = {
  "inputs": [
    {
      "components": [
        {"internalType": "address", "name": "considerationToken", "type": "address"},
        {"internalType": "uint256", "name": "considerationIdentifier", "type": "uint256"},
        {"internalType": "uint256", "name": "considerationAmount", "type": "uint256"},
        {"internalType": "address payable", "name": "offerer", "type": "address"},
        {"internalType": "address", "name": "zone", "type": "address"},
        {"internalType": "address", "name": "offerToken", "type": "address"},
        {"internalType": "uint256", "name": "offerIdentifier", "type": "uint256"},
        {"internalType": "uint256", "name": "offerAmount", "type": "uint256"},
        {"internalType": "enum BasicOrderType", "name": "basicOrderType", "type": "uint8"},
        {"internalType": "uint256", "name": "startTime", "type": "uint256"},
        {"internalType": "uint256", "name": "endTime", "type": "uint256"},
        {"internalType": "bytes32", "name": "zoneHash", "type": "bytes32"},
        {"internalType": "uint256", "name": "salt", "type": "uint256"},
        {"internalType": "bytes32", "name": "offererConduitKey", "type": "bytes32"},
        {"internalType": "bytes32", "name": "fulfillerConduitKey", "type": "bytes32"},
        {"internalType": "uint256", "name": "totalOriginalAdditionalRecipients", "type": "uint256"},
        {
          "components": [
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "address payable", "name": "recipient", "type": "address"}
          ],
          "internalType": "struct AdditionalRecipient[]",
          "name": "additionalRecipients",
          "type": "tuple[]"
        },
        {"internalType": "bytes", "name": "signature", "type": "bytes"}
      ],
      "internalType": "struct BasicOrderParameters",
      "name": "parameters",
      "type": "tuple"
    }
  ],
  "name": "fulfillBasicOrder_efficient_6GL6yc",
  "outputs": [{"internalType": "bool", "name": "fulfilled", "type": "bool"}],
  "stateMutability": "payable",
  "type": "function"
};

// Additional instructions for the AI
const additionalInstructions = "Focus on the user-friendly fields for NFT purchasing (like offer token, consideration token, amounts, offerer) and exclude technical fields like signatures, hashes, and internal parameters.";

// Create the payload using the utility function
const payload = createERC7730Prompt(contractInfo, abi, additionalInstructions);

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASI_API_KEY}`
};

fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => {
    console.log('🤖 ASI Response:');
    console.log('================');
    
    if (data.choices && data.choices.length > 0) {
      const message = data.choices[0].message;
      console.log(`Role: ${message.role}`);
      console.log(`Content: ${message.content}`);
      
      if (data.usage) {
        console.log('\n📊 Usage Stats:');
        console.log(`- Prompt tokens: ${data.usage.prompt_tokens}`);
        console.log(`- Completion tokens: ${data.usage.completion_tokens}`);
        console.log(`- Total tokens: ${data.usage.total_tokens}`);
      }
    } else {
      console.log('No response choices found');
      console.log('Raw response:', data);
    }
  })
  .catch(console.error);
