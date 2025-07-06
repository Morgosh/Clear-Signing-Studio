interface ContractData {
  projectName: string
  contractAddress: string
  contractDescription: string
  contractCode: string
  abi: string
  chainId: number
}

interface ERC7730Result {
  success: boolean
  erc7730Json: string
  functionCount: number
  message: string
}

export function generateERC7730Fallback(body: ContractData): ERC7730Result {
  console.log('Using local ERC-7730 generation (AgentVerse integration pending)');
  
  const parsedABI = JSON.parse(body.abi);
  const functions = parsedABI.filter((item: any) => item.type === 'function');
  
  // Generate ERC-7730 metadata structure
  const erc7730Data = {
    context: {
      contract: {
        address: body.contractAddress,
        chainId: body.chainId,
        name: body.projectName
      }
    },
    metadata: {
              owner: "Clear Signing Studio",
      info: {
        url: `https://etherscan.io/address/${body.contractAddress}`,
        legalName: body.projectName,
        lastUpdate: new Date().toISOString(),
        description: body.contractDescription || `Smart contract for ${body.projectName}`
      },
      token: {
        name: body.projectName,
        ticker: body.projectName.toUpperCase().slice(0, 4)
      }
    },
    display: {
      formats: {} as Record<string, any>
    }
  };
  
  // Generate display formats for functions
  functions.forEach((func: any) => {
    const funcName = func.name;
    const inputs = func.inputs || [];
    
    // Create format based on function type
    if (funcName.toLowerCase().includes('transfer')) {
      erc7730Data.display.formats[funcName] = {
        intent: `Transfer {{amount}} to {{recipient}}`,
        fields: inputs.map((input: any, index: number) => ({
          path: input.name || `param${index}`,
          label: input.name === 'to' ? 'Recipient' : 
                 input.name === 'amount' ? 'Amount' : 
                 input.name || `Parameter ${index + 1}`,
          format: input.type === 'address' ? 'addressName' : 
                 input.type.includes('uint') ? 'amount' : 'raw'
        }))
      };
    } else if (funcName.toLowerCase().includes('approve')) {
      erc7730Data.display.formats[funcName] = {
        intent: `Approve {{spender}} to spend {{amount}}`,
        fields: inputs.map((input: any, index: number) => ({
          path: input.name || `param${index}`,
          label: input.name === 'spender' ? 'Spender' : 
                 input.name === 'amount' ? 'Amount' : 
                 input.name || `Parameter ${index + 1}`,
          format: input.type === 'address' ? 'addressName' : 
                 input.type.includes('uint') ? 'amount' : 'raw'
        }))
      };
    } else {
      // Generic format for other functions
      erc7730Data.display.formats[funcName] = {
        intent: `Call ${funcName}(${inputs.map((i: any) => `{{${i.name || 'param'}}}`).join(', ')})`,
        fields: inputs.map((input: any, index: number) => ({
          path: input.name || `param${index}`,
          label: input.name || `Parameter ${index + 1}`,
          format: input.type === 'address' ? 'addressName' : 
                 input.type.includes('uint') ? 'amount' : 'raw'
        }))
      };
    }
  });

  return {
    success: true,
    erc7730Json: JSON.stringify(erc7730Data, null, 2),
    functionCount: functions.length,
    message: `Generated ERC-7730 metadata for ${body.projectName} (${functions.length} functions)`
  };
} 