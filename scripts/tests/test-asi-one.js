const url = 'https://api.asi1.ai/v1/chat/completions';

const payload = {
  model: 'asi1-mini',
  messages: [
    {
      role: 'system',
      content: 'asdf'
    },
    {
      role: 'user',
      content: 'hey how are you?'
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
