# Clear Signing Studio Examples

This directory contains complete examples of ERC-7730 clear signing implementations for different protocols and use cases.

## 📁 Directory Structure

```
examples/
├── seaport/                    # OpenSea Seaport protocol examples
│   ├── calldata/              # Calldata clear signing examples
│   │   └── eip7730Calldata.json
│   ├── eip712/                # EIP-712 message signing examples
│   │   ├── eip7730osea1.6.json
│   │   └── exampleListing.json
│   └── abi/                   # Contract ABIs
│       └── oseaABI.json
└── README.md                  # This file
```

## 🏪 Seaport Examples

### Calldata Clear Signing (`seaport/calldata/`)

**`eip7730Calldata.json`**
- **Purpose**: Clear signing for Seaport calldata transactions
- **Function**: `fulfillBasicOrder_efficient_6GL6yc` (selector: `0x00000000`)
- **Features**:
  - NFT contract and token ID display
  - Payment token and price formatting
  - Seller address resolution
  - Field exclusion for technical parameters

### EIP-712 Message Signing (`seaport/eip712/`)

**`eip7730osea1.6.json`**
- **Purpose**: Clear signing for Seaport EIP-712 order messages
- **Version**: OpenSea v1.6 compatibility
- **Features**:
  - Structured order data display
  - Offer and consideration items
  - Fee recipient handling
  - Order expiration and timing

**`exampleListing.json`**
- **Purpose**: Example of a complete Seaport listing message
- **Use Case**: NFT marketplace listing with royalties and fees

### Contract ABI (`seaport/abi/`)

**`oseaABI.json`**
- **Purpose**: Complete Seaport contract ABI
- **Usage**: Referenced by calldata examples for parameter validation
- **Functions**: All Seaport contract functions with full parameter definitions

## 🛠️ Using These Examples

### Validation
```bash
# Validate calldata example
node ../scripts/validators/validateCalldataSeaport.mjs

# Validate EIP-712 example
node ../scripts/validators/validateEIP712Seaport.mjs
```

### Integration
These examples can be used as templates for:
- Hardware wallet integration
- dApp clear signing implementation
- Custom protocol descriptor creation
- Validation testing and development

## 📚 Learning Resources

Each example demonstrates different aspects of ERC-7730:
- **Path syntax**: How to reference transaction data (`#.parameter.field`)
- **Format types**: `addressName`, `tokenAmount`, `raw`, etc.
- **Address resolution**: Contract vs. wallet address handling
- **Field exclusion**: Hiding technical parameters from users
- **Nested structures**: Arrays and complex data types

## 🔧 Customization

To create your own protocol examples:
1. Copy the Seaport structure as a template
2. Update the ABI for your contract
3. Modify field paths and display formats
4. Add validation scripts in `../scripts/validators/`
5. Test with the ERC-7730 validator

## 📞 Support

For questions about these examples:
- Check the main project README
- Review the ERC-7730 specification
- Open an issue for protocol-specific questions 


# Agent goal
- Agent proposes EIP7730 Calldata and EIP712 json files for your contract. 
- We integrate validators that the JSON is valid.
- Verification that ABI matches on etherscan or other scanner.
- The Agent signs the EIP7730 vouching its legitimate and helpful for human users
- The Agent periodically scans the blockchain searching for new protocols and automatically proposes new EIP7730 json files and does updates on new contract versions  