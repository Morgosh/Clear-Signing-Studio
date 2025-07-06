'use client'

import React, { useState } from 'react'
import { createERC7730Prompt } from '../utils/createERC7730Prompt'
import { validateMetadata } from '../utils/validateMetadata.js'

interface ContractData {
  projectName: string
  contractAddress: string
  contractDescription: string
  contractCode: string
  abi: string
  chainId: number
}

interface ABIItem {
  type: string
  name?: string
  inputs?: unknown[]
  outputs?: unknown[]
  stateMutability?: string
}

interface ValidationResult {
  valid: boolean
  errors: any[] | null | undefined
  contextType: string
}

const SAMPLE_CONTRACTS = {
  seaport: {
    projectName: 'OpenSea Seaport',
    contractAddress: '0x0000000000000068f116a894984e2db1123eb395',
    contractDescription: 'OpenSea Seaport protocol for NFT marketplace transactions and basic order fulfillment',
    contractCode: 'pragma solidity ^0.8.0; contract Seaport { function fulfillBasicOrder_efficient_6GL6yc(BasicOrderParameters calldata parameters) external payable returns (bool fulfilled); }',
    abi: JSON.stringify([
      {
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
      }
    ], null, 2),
    chainId: 1
  },
  usdc: {
    projectName: 'USD Coin',
    contractAddress: '0xA0b86991c31cC27bDC9d30dDC89e7bF0671f18b8C',
    contractDescription: 'USDC is a fully collateralized US dollar stablecoin',
    contractCode: 'pragma solidity ^0.8.0; contract USDC { function transfer(address to, uint256 amount) public returns (bool); }',
    abi: JSON.stringify([
      {"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]},
      {"type":"function","name":"approve","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}]},
      {"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}]}
    ], null, 2),
    chainId: 1
  }
}

export default function Home() {
  const [contractData, setContractData] = useState<ContractData>({
    projectName: 'OpenSea Seaport',
    contractAddress: '0x0000000000000068f116a894984e2db1123eb395',
    contractDescription: 'OpenSea Seaport protocol for NFT marketplace transactions. Enables efficient NFT trading with basic order fulfillment for buying and selling digital assets.',
    contractCode: 'pragma solidity ^0.8.0;\n\ncontract Seaport {\n    function fulfillBasicOrder_efficient_6GL6yc(\n        BasicOrderParameters calldata parameters\n    ) external payable returns (bool fulfilled);\n}',
    abi: JSON.stringify([
      {
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
      }
    ], null, 2),
    chainId: 1
  })
  
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedJson, setGeneratedJson] = useState<string>('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setResults(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 10))
  }

  const loadSampleContract = (sampleKey: keyof typeof SAMPLE_CONTRACTS) => {
    const sample = SAMPLE_CONTRACTS[sampleKey]
    setContractData(sample)
    setGeneratedJson('')
    setValidationResult(null)
    addResult(`Loaded ${sample.projectName} sample contract`)
  }

  const generateERC7730 = async () => {
    if (!contractData.projectName || !contractData.contractAddress || !contractData.abi) {
      addResult('❌ Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setValidationResult(null)
    addResult(`🔄 Generating ERC-7730 metadata for ${contractData.projectName}...`)

    try {
      // Parse the ABI to get the first function for the prompt
      const abiArray = JSON.parse(contractData.abi) as ABIItem[]
      const functionAbi = abiArray.find((item: ABIItem) => item.type === 'function')
      
      if (!functionAbi) {
        addResult('❌ No function found in ABI')
        return
      }

      // Prepare contract info for the utility function
      const contractInfo = {
        name: contractData.projectName,
        owner: contractData.projectName.includes('OpenSea') ? 'OpenSea' : contractData.projectName + ' Team',
        legalName: contractData.projectName.includes('OpenSea') ? 'Ozone Networks, Inc.' : contractData.projectName + ' Foundation',
        url: contractData.projectName.includes('OpenSea') ? 'https://opensea.io' : 'https://example.com',
        address: contractData.contractAddress,
        chainId: contractData.chainId
      }

      // Create the prompt payload using the utility function
      const payload = createERC7730Prompt(
        contractInfo,
        functionAbi as any,
        `Focus on user-friendly fields and exclude technical parameters. ${contractData.contractDescription ? 'Description: ' + contractData.contractDescription : ''}`
      )

      addResult(`🤖 Calling ASI API directly...`)

      // Make the API call directly to ASI
      const response = await fetch('https://api.asi1.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASI_API_KEY}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.choices && result.choices[0]) {
        const content = result.choices[0].message.content
        
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0])
            const formattedJson = JSON.stringify(extractedJson, null, 2)
            
            // Validate the generated metadata
            addResult(`🔍 Validating generated ERC-7730 metadata...`)
            const validation = validateMetadata(extractedJson)
            setValidationResult(validation)
            
            if (validation.valid) {
              addResult(`✅ ERC-7730 metadata is valid! Context type: ${validation.contextType}`)
            } else {
              const errorCount = validation.errors?.length || 0
              addResult(`⚠️ ERC-7730 metadata has validation issues: ${errorCount} errors found`)
              validation.errors?.forEach((error, index) => {
                addResult(`   Error ${index + 1}: ${error.instancePath} ${error.message}`)
              })
            }
            
            addResult(`✅ Successfully generated ERC-7730 metadata`)
            setGeneratedJson(formattedJson)
            
            // Count functions in the generated metadata
            const functionCount = extractedJson.display?.formats ? Object.keys(extractedJson.display.formats).length : 0
            addResult(`📄 Generated ${functionCount} function formats`)
            
            if (result.usage) {
              addResult(`📊 Used ${result.usage.total_tokens} tokens (${result.usage.prompt_tokens} prompt + ${result.usage.completion_tokens} completion)`)
            }
          } catch (parseError) {
            addResult(`⚠️ Generated content but failed to parse JSON: ${parseError}`)
            setGeneratedJson(content)
            setValidationResult(null)
          }
        } else {
          addResult(`⚠️ No JSON found in response`)
          setGeneratedJson(content)
          setValidationResult(null)
        }
      } else {
        addResult(`❌ ASI API Error: ${result.error?.message || 'Unknown error'}`)
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson)
    addResult('📋 Copied to clipboard!')
  }

  const downloadJson = () => {
    if (!generatedJson) return
    
    const blob = new Blob([generatedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `erc7730_${contractData.projectName.toLowerCase().replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    addResult('💾 Downloaded ERC-7730 file!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Clear Signing Studio
          </h1>
          <p className="text-gray-600 text-lg">
            Autonomous agent for Ledger clear signing metadata
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              ✅ Agent Running
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              🔒 ERC-7730 Compliant
            </span>
            {validationResult && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                validationResult.valid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {validationResult.valid ? '✅ Valid Metadata' : '⚠️ Validation Issues'}
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📝 Contract Input</h2>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => loadSampleContract('seaport')}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                Load Seaport Sample
              </button>
              <button
                onClick={() => loadSampleContract('usdc')}
                className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600"
              >
                Load USDC Sample
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={contractData.projectName}
                  onChange={(e) => setContractData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="e.g., USD Coin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Address *
                </label>
                <input
                  type="text"
                  value={contractData.contractAddress}
                  onChange={(e) => setContractData(prev => ({ ...prev, contractAddress: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={contractData.contractDescription}
                  onChange={(e) => setContractData(prev => ({ ...prev, contractDescription: e.target.value }))}
                  placeholder="Brief description of the contract..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract ABI *
                </label>
                <textarea
                  value={contractData.abi}
                  onChange={(e) => setContractData(prev => ({ ...prev, abi: e.target.value }))}
                  placeholder='[{"type":"function","name":"transfer"...}]'
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blockchain
                </label>
                <select 
                  value={contractData.chainId.toString()} 
                  onChange={(e) => setContractData(prev => ({ ...prev, chainId: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="1">Ethereum Mainnet</option>
                  <option value="11155111">Ethereum Sepolia</option>
                  <option value="137">Polygon</option>
                  <option value="56">BSC</option>
                </select>
              </div>

              <button
                onClick={generateERC7730}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '⏳ Generating...' : '🚀 Generate ERC-7730 Metadata'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            
            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Activity Log</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No activity yet. Load a sample or generate metadata!
                  </p>
                ) : (
                  results.map((result, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-500">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Generated JSON */}
            {generatedJson && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">📄 Generated ERC-7730 JSON</h3>
                    {validationResult && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        validationResult.valid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {validationResult.valid ? '✅ Valid' : `⚠️ ${validationResult.errors?.length || 0} errors`}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={downloadJson}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
                {validationResult && !validationResult.valid && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-800 font-medium mb-1">Validation Issues:</p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      {validationResult.errors?.slice(0, 3).map((error, index) => (
                        <li key={index}>• {error.instancePath || 'root'}: {error.message}</li>
                      ))}
                                             {(validationResult.errors?.length || 0) > 3 && (
                         <li>• ... and {(validationResult.errors?.length || 0) - 3} more errors</li>
                       )}
                    </ul>
                  </div>
                )}
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {generatedJson}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>🤖 Built with uAgents • 🔒 ERC-7730 Compliant • 🚀 Hackathon Ready</p>
        </div>
      </div>
    </div>
  )
}
