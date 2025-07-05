const url = 'https://api.asi1.ai/v1/chat/completions';

const payload = {
  model: 'asi1-mini',
  messages: [
    {
      role: 'user',
      content: '"@7730 agent" Generate ERC-7730 for contract 0xA0b86a33E6441d6F71c2F6d8b0A8f6A7f8d6e7c5 named USDC'
    }
  ],
  temperature: 0,
  stream: false,
  max_tokens: 500
};

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer sk_3ff7b7e8fdfd43b2a848110cd43a9b8a670a3d6456d048489b26c2816c1af8a9'  // Replace with your actual API key
};

fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify(payload)
})
  .then(response => response.text())
  .then(console.log)
  .catch(console.error);
