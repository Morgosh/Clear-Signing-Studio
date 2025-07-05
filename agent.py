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
    api_key='eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NTQyMzc4MzksImlhdCI6MTc1MTY0NTgzOSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiI1ZDM3OGE3OTY2MTFmNzdjNmM1OTU5ZDgiLCJzY29wZSI6ImF2Iiwic3ViIjoiNTkyYmU0ZjZjMGRhOGQ1NTI1OGRmODE2NDE3ZTM3MTc5OGRhYTQ2ODkwNjk3NjczIn0.WVEKLdmMVeuV4kp5or-2CNBRSScS6q-d1lvTyJnPaBy2kx5ETU23nGwrV1kSqhhOj3U5H2q10SOnYmGCUIcgFT1OAYcLCVuoiPB9yLifNkeptGk151hPZcOoeaq_jryPeipl2awsg1m8zFvZmFWoKowAeZdr0dn7mRqm4SH58xOzM34OHN3DJ9eSRk4AlNH9ngU4ZWs0TJYey2w5WaUOF0Hw-ZPBKESvEEH4tV32HGJ5E_NQHyschqqX0ZfwIStROwFBxSR23VK5JK_X2ZVl68_ZP5ludqz3_0euz0G7L0IIbqAcXuuOYwQaXjoliodhEGHBIfNlvAX1HKaOljvpEQ',
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

async def generate_erc7730_metadata(ctx: Context, contract_input: ContractInput):
    try:
        abi_data = json.loads(contract_input.abi)
        functions = [item for item in abi_data if item.get('type') == 'function']
    except:
        functions = []
    
    display_formats = {}
    
    for func in functions:
        func_name = func.get('name', '')
        inputs = func.get('inputs', [])
        
        if 'transfer' in func_name.lower():
            display_formats[func_name] = {
                "intent": f"Transfer tokens to recipient",
                "fields": [{"path": "to", "label": "Recipient", "format": "addressName"}]
            }
        elif 'approve' in func_name.lower():
            display_formats[func_name] = {
                "intent": f"Approve spender",
                "fields": [{"path": "spender", "label": "Spender", "format": "addressName"}]
            }
        else:
            display_formats[func_name] = {
                "intent": f"Call {func_name}",
                "fields": [{"path": p.get('name', 'param'), "label": p.get('name', 'param'), "format": "raw"} for p in inputs]
            }
    
    return {
        "context": {
            "contract": {
                "address": contract_input.contract_address,
                "chainId": contract_input.chain_id,
                "name": contract_input.project_name,
                "abi": contract_input.abi
            }
        },
        "metadata": {
            "owner": "ERC-7730 Agent",
            "info": {
                "legalName": contract_input.project_name,
                "lastUpdate": datetime.now().isoformat(),
                "description": contract_input.contract_description
            }
        },
        "display": {"formats": display_formats}
    }

agent.include(chat_protocol, publish_manifest=True)

@agent.on_event("startup")
async def startup_event(ctx: Context):
    ctx.logger.info("🚀 ERC-7730 Agent Ready")

if __name__ == "__main__":
    print("🌟 ERC-7730 Generator Agent")
    print(f"🔗 Address: {agent.address}")
    agent.run() 