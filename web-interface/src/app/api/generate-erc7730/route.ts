//you can find model implementation in root ./agent.py, which is hosted on agentverse.ai

import { NextRequest, NextResponse } from 'next/server'
import { generateERC7730Fallback } from './erc7730-fallback'

interface ContractData {
  projectName: string
  contractAddress: string
  contractDescription: string
  contractCode: string
  abi: string
  chainId: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ContractData = await request.json()
    
    // Validate required fields
    if (!body.projectName || !body.contractAddress || !body.abi) {
      return NextResponse.json(
        { error: 'Missing required fields: projectName, contractAddress, and abi are required' },
        { status: 400 }
      )
    }

    // Validate ABI format
    try {
      JSON.parse(body.abi)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid ABI format. Please provide a valid JSON array.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AGENT_VERSE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Use ASI:One Chat Completion API
    if (apiKey) {
      try {
        console.log('🚀 Using ASI:One Chat Completion API...');
        
        const naturalLanguageQuery = `Generate ERC-7730 metadata for smart contract "${body.projectName}" at address ${body.contractAddress} on chain ID ${body.chainId}.

Contract Details:
- Address: ${body.contractAddress}
- Name: ${body.projectName}
- Description: ${body.contractDescription || 'Smart contract'}
- Chain ID: ${body.chainId}
- ABI: ${body.abi}

Please create the complete ERC-7730 JSON metadata for Ledger clear signing.`;
        
        const payload = {
          model: "asi1-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert in ERC-7730 metadata generation for smart contracts. Generate valid ERC-7730 JSON metadata for Ledger clear signing. Always respond with properly formatted JSON."
            },
            {
              role: "user",
              content: naturalLanguageQuery
            }
          ],
          temperature: 0.3,
          stream: false,
          max_tokens: 2000
        };
        
        const response = await fetch('https://api.asi1.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.choices && result.choices[0] && result.choices[0].message) {
            const content = result.choices[0].message.content;
            
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const extractedJson = JSON.parse(jsonMatch[0]);
                if (extractedJson.context || extractedJson.metadata) {
                  return NextResponse.json({
                    success: true,
                    erc7730Json: JSON.stringify(extractedJson, null, 2),
                    functionCount: extractedJson.display?.formats ? Object.keys(extractedJson.display.formats).length : 0,
                    message: `Generated via ASI:One: ${body.projectName}`
                  });
                }
              } catch (e) {
                console.log('Could not parse JSON from ASI:One response');
              }
            }
            
            // If no JSON found, return the raw response
            return NextResponse.json({
              success: true,
              erc7730Json: content,
              functionCount: 0,
              message: `ASI:One response for ${body.projectName}`
            });
          }
        } else {
          const errorText = await response.text();
          console.error('ASI:One API failed:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
        }

        console.log('ASI:One API failed, falling back to local generation');
        
      } catch (error) {
        console.error('ASI:One API error:', error);
        console.log('Falling back to local generation');
      }
    }
    
    // Local ERC-7730 generation (fallback)
    const fallbackResult = generateERC7730Fallback(body);
    
    return NextResponse.json(fallbackResult)

  } catch (error) {
    console.error('Error generating ERC-7730 metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating ERC-7730 metadata' },
      { status: 500 }
    )
  }
} 