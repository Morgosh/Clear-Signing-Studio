#!/usr/bin/env python3

import json
import re
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
from pydantic import BaseModel

from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

class ContractInput(BaseModel):
    contract_address: str
    contract_description: str
    contract_code: str
    abi: str
    project_name: str
    chain_id: int = 1
    requester: str

agent = Agent(
    base_url='https://api.asi1.ai/v1',
    api_key='insert_your_api_key_here',
)

fund_agent_if_low(agent.wallet.address())

chat_protocol = Protocol(spec=chat_protocol_spec)

@chat_protocol.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id))
    
    text_content = "".join(item.text for item in msg.content if isinstance(item, TextContent))
    
    try:
        if any(keyword in text_content.lower() for keyword in ['erc-7730', 'erc7730', 'metadata', 'generate', 'contract']):
            address_match = re.search(r'0x[a-fA-F0-9]{40}', text_content)
            name_match = re.search(r'named\s+"([^"]+)"|named\s+([A-Za-z][A-Za-z0-9_]*)|"([^"]+)"\s+contract', text_content, re.IGNORECASE)
            
            if address_match and name_match:
                contract_address = address_match.group()
                project_name = name_match.group(1) or name_match.group(2) or name_match.group(3)
                
                contract_input = ContractInput(
                    contract_address=contract_address,
                    contract_description=f"Smart contract for {project_name}",
                    contract_code="",
                    abi="[]",
                    project_name=project_name,
                    chain_id=1,
                    requester="asi-one"
                )
                
                erc7730_data = await generate_erc7730_metadata(ctx, contract_input)
                response_text = f"✅ Generated ERC-7730 for {project_name}\n\n```json\n{json.dumps(erc7730_data, indent=2)}\n```"
            else:
                response_text = "To generate ERC-7730 metadata, provide: contract address and project name.\nExample: Generate ERC-7730 for contract 0x1234... named MyToken"
        else:
            response_text = "Hello! I generate ERC-7730 metadata for smart contracts. Just provide the contract address and project name!"
        
        await ctx.send(sender, ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=response_text), EndSessionContent(type="end-session")]
        ))
        
    except Exception as e:
        await ctx.send(sender, ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=f"Error: {str(e)}"), EndSessionContent(type="end-session")]
        ))

@chat_protocol.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass

def get_chain_name(chain_id: int) -> str:
    chains = {
        1: "Ethereum Mainnet",
        3: "Ropsten",
        4: "Rinkeby", 
        5: "Goerli",
        10: "Optimism",
        56: "BSC",
        137: "Polygon",
        250: "Fantom",
        42161: "Arbitrum One",
        43114: "Avalanche"
    }
    return chains.get(chain_id, f"Chain {chain_id}")

def format_function_signature(func):
    """Create a proper function signature for ERC-7730 display formats"""
    name = func.get('name', '')
    inputs = func.get('inputs', [])
    
    def format_type(param):
        param_type = param.get('type', '')
        if param.get('components'):  # Handle structs
            return 'tuple'
        return param_type
    
    param_types = [format_type(inp) for inp in inputs]
    return f"{name}({','.join(param_types)})"

def generate_display_fields(func):
    """Generate display fields for a function based on parameter analysis"""
    inputs = func.get('inputs', [])
    fields = []
    excluded = []
    
    for inp in inputs:
        param_name = inp.get('name', 'param')
        param_type = inp.get('type', '')
        
        # Handle struct components
        if inp.get('components'):
            for component in inp['components']:
                comp_name = component.get('name', '')
                comp_type = component.get('type', '')
                comp_path = f"#.{param_name}.{comp_name}"
                
                # Smart field detection based on naming patterns
                if any(keyword in comp_name.lower() for keyword in ['token', 'contract', 'address']) and comp_type == 'address':
                    if 'consideration' in comp_name.lower() or 'payment' in comp_name.lower():
                        fields.append({
                            "path": comp_path,
                            "label": "Payment Token",
                            "format": "addressName",
                            "params": {"types": ["contract", "token"]}
                        })
                    elif 'offer' in comp_name.lower():
                        fields.append({
                            "path": comp_path,
                            "label": "NFT Contract", 
                            "format": "addressName",
                            "params": {"types": ["contract", "token"]}
                        })
                    else:
                        fields.append({
                            "path": comp_path,
                            "label": comp_name.replace('_', ' ').title(),
                            "format": "addressName",
                            "params": {"types": ["contract", "token"]}
                        })
                
                elif any(keyword in comp_name.lower() for keyword in ['amount', 'value', 'price']) and 'uint' in comp_type:
                    # Try to find corresponding token path
                    token_path = None
                    for other_comp in inp['components']:
                        if 'token' in other_comp.get('name', '').lower() and other_comp.get('type') == 'address':
                            token_path = f"#.{param_name}.{other_comp['name']}"
                            break
                    
                    field_data = {
                        "path": comp_path,
                        "label": "Price" if 'consideration' in comp_name.lower() else "Amount",
                        "format": "tokenAmount"
                    }
                    if token_path:
                        field_data["params"] = {"tokenPath": token_path}
                    
                    fields.append(field_data)
                
                elif any(keyword in comp_name.lower() for keyword in ['offerer', 'seller', 'owner']) and comp_type == 'address':
                    fields.append({
                        "path": comp_path,
                        "label": "Seller",
                        "format": "addressName", 
                        "params": {"types": ["wallet", "eoa"]}
                    })
                
                elif any(keyword in comp_name.lower() for keyword in ['recipient', 'to', 'buyer']) and comp_type == 'address':
                    fields.append({
                        "path": comp_path,
                        "label": "Recipient",
                        "format": "addressName",
                        "params": {"types": ["wallet", "eoa", "contract"]}
                    })
                
                elif 'identifier' in comp_name.lower() and 'uint' in comp_type:
                    fields.append({
                        "path": comp_path,
                        "label": "Token ID",
                        "format": "raw"
                    })
                
                elif any(keyword in comp_name.lower() for keyword in ['time', 'deadline', 'expiry']) and 'uint' in comp_type:
                    fields.append({
                        "path": comp_path,
                        "label": "Deadline" if 'deadline' in comp_name.lower() else "Expiration",
                        "format": "timestamp"
                    })
                
                else:
                    # Technical fields to exclude
                    if any(tech in comp_name.lower() for tech in ['signature', 'hash', 'salt', 'nonce', 'key', 'conduit', 'zone']):
                        excluded.append(comp_path)
        
        else:
            # Handle simple parameters
            param_path = f"#.{param_name}"
            
            if param_type == 'address':
                if any(keyword in param_name.lower() for keyword in ['to', 'recipient']):
                    fields.append({
                        "path": param_path,
                        "label": "Recipient",
                        "format": "addressName",
                        "params": {"types": ["wallet", "eoa", "contract"]}
                    })
                elif any(keyword in param_name.lower() for keyword in ['spender', 'approved']):
                    fields.append({
                        "path": param_path,
                        "label": "Spender",
                        "format": "addressName", 
                        "params": {"types": ["wallet", "eoa", "contract"]}
                    })
                else:
                    fields.append({
                        "path": param_path,
                        "label": param_name.replace('_', ' ').title(),
                        "format": "addressName",
                        "params": {"types": ["contract", "token"]}
                    })
            
            elif 'uint' in param_type and any(keyword in param_name.lower() for keyword in ['amount', 'value']):
                fields.append({
                    "path": param_path,
                    "label": "Amount",
                    "format": "tokenAmount",
                    "params": {"tokenPath": "@.to"}  # Default token reference
                })
    
    return fields, excluded

def determine_intent(func_name: str, inputs: list) -> str:
    """Determine user-friendly intent based on function name and parameters"""
    name_lower = func_name.lower()
    
    if 'fulfillbasicorder' in name_lower or 'fulfill' in name_lower:
        return "Buy NFT (Basic Order)"
    elif 'transfer' in name_lower:
        return "Transfer Tokens"
    elif 'approve' in name_lower:
        return "Approve Token Spending"
    elif 'deposit' in name_lower:
        return "Deposit Tokens"
    elif 'withdraw' in name_lower:
        return "Withdraw Tokens"
    elif 'swap' in name_lower:
        return "Swap Tokens"
    elif 'mint' in name_lower:
        return "Mint Tokens"
    elif 'burn' in name_lower:
        return "Burn Tokens"
    elif 'stake' in name_lower:
        return "Stake Tokens"
    elif 'claim' in name_lower:
        return "Claim Rewards"
    else:
        return f"Execute {func_name.replace('_', ' ').title()}"

async def generate_erc7730_metadata(ctx: Context, contract_input: ContractInput):
    try:
        abi_data = json.loads(contract_input.abi) if contract_input.abi else []
        functions = [item for item in abi_data if item.get('type') == 'function']
    except:
        functions = []
    
    display_formats = {}
    
    # Generate formats for each function
    for func in functions:
        func_name = func.get('name', '')
        signature = format_function_signature(func)
        fields, excluded = generate_display_fields(func)
        intent = determine_intent(func_name, func.get('inputs', []))
        
        format_data = {
            "intent": intent,
            "fields": fields
        }
        
        if excluded:
            format_data["excluded"] = excluded
        
        display_formats[signature] = format_data
    
    # Handle special cases based on project name
    is_opensea = 'opensea' in contract_input.project_name.lower() or 'seaport' in contract_input.project_name.lower()
    
    metadata_info = {
        "legalName": "Ozone Networks, Inc." if is_opensea else f"{contract_input.project_name} Foundation",
        "url": "https://opensea.io" if is_opensea else "https://example.com"
    }
    
    if contract_input.contract_description:
        metadata_info["description"] = contract_input.contract_description
    
    return {
        "$schema": "../../specs/erc7730-v1.schema.json",
        "context": {
            "contract": {
                "abi": abi_data,
                "deployments": [{
                    "chainId": contract_input.chain_id,
                    "address": contract_input.contract_address
                }]
            }
        },
        "metadata": {
            "owner": "OpenSea" if is_opensea else f"{contract_input.project_name} Team",
            "info": metadata_info
        },
        "display": {
            "formats": display_formats
        }
    }

agent.include(chat_protocol, publish_manifest=True)

@agent.on_event("startup")
async def startup_event(ctx: Context):
    ctx.logger.info("🚀 Clear Signing Studio Agent Ready")

if __name__ == "__main__":
    print("🌟 Clear Signing Studio Agent")
    print(f"🔗 Address: {agent.address}")
    agent.run() 