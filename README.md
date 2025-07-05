# ERC-7730 Generator Agent

A simple autonomous agent that generates ERC-7730 clear signing metadata for Ethereum smart contracts.

## What it does

Takes contract details (address, description, code, ABI, project name) and generates Ledger-compatible ERC-7730 JSON metadata for clear signing.

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the agent:
```bash
python3 agent.py
```

The agent will start listening for contract input messages and generate ERC-7730 metadata files.

## Input Format

Send contract details in this format:
```json
{
  "contract_address": "0xA0b86991c31cC27bDC9d30dDC89e7bF0671f18b8C",
  "contract_description": "USDC is a fully collateralized US dollar stablecoin",
  "contract_code": "pragma solidity ^0.8.0; contract USDC { ... }",
  "abi": "[{\"type\":\"function\",\"name\":\"transfer\",\"inputs\":[...]}]",
  "project_name": "USD Coin",
  "chain_id": 1,
  "requester": "user_or_system"
}
```

## Output

Generates ERC-7730 compliant JSON files with:
- Contract context and metadata
- Human-readable transaction formats
- Function-specific display templates

Built with uAgents framework. 
