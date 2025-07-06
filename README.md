# Clear Signing Studio

An intelligent toolkit for creating, validating, and managing ERC-7730 clear signing metadata, with examples for Seaport marketplace EIP-712 and calldata implementations.

## 🚀 Overview

Clear Signing Studio is a comprehensive solution for working with ERC-7730 clear signing metadata - the emerging standard for providing human-readable descriptions of smart contract interactions. This project focuses on making complex DeFi and NFT transactions more accessible by generating clear, user-friendly transaction descriptions for hardware wallets and signing interfaces. Powered by ASI AI for intelligent ERC-7730 suggestions and includes complete examples for Seaport marketplace covering both EIP-712 and calldata scenarios.

### Key Features

- **🔍 ERC-7730 Validation**: Comprehensive validation engine with support for the latest ERC-7730 specification
- **🏪 Seaport Examples**: Complete examples for OpenSea's Seaport protocol EIP-712 and calldata clear signing
- **🤖 AI-Powered Generation**: Intelligent clear signing generation using ASI AI agents for ERC-7730 suggestions
- **🌐 Web Interface**: Modern Next.js interface for interactive clear signing management
- **📊 Schema Validation**: Robust JSON schema validation with detailed error reporting
- **🔧 Developer Tools**: CLI tools and utilities for clear signing development

## 🏗️ Architecture

```
asi/
├── agent.py                    # ASI AI agent for clear signing generation
├── web-interface/              # Next.js web application
│   ├── src/app/api/           # API endpoints
│   ├── src/utils/             # Validation utilities
│   └── validateCalldataSeaport.mjs
├── eip7730Calldata.json       # Seaport calldata clear signing
├── eip7730osea1.6.json        # OpenSea clear signing v1.6
├── oseaABI.json               # Seaport contract ABI
└── requirements.txt           # Python dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asi
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd web-interface
   npm install
   ```

### Usage

#### Web Interface
```bash
cd web-interface
npm run dev
```
Visit `http://localhost:3000` to access the web interface.

#### CLI Validation
```bash
# Validate ERC-7730 clear signing metadata
node web-interface/validateCalldataSeaport.mjs

# Run comprehensive validation
node web-interface/test-validator.mjs
```

#### ASI AI Agent
```bash
# Generate clear signing metadata using ASI AI
python agent.py
```

## 📋 Example Implementations

### Seaport (OpenSea) - EIP-712 & Calldata Examples
- ✅ **EIP-712 Messages**: Seaport order signing with structured data
- ✅ **Calldata**: Basic order fulfillment (`fulfillBasicOrder_efficient_6GL6yc`)
- ✅ Advanced order types and parameters
- ✅ Consideration and offer items
- ✅ Fee recipients and royalties
- ✅ Contract and token address resolution

### ERC-7730 Features
- ✅ Calldata clear signing
- ✅ EIP-712 message clear signing
- ✅ Address name resolution
- ✅ Token amount formatting
- ✅ Field exclusion and filtering

## 🔧 Configuration

The project includes several example configuration files:

- `eip7730Calldata.json` - Seaport calldata clear signing example
- `eip7730osea1.6.json` - Seaport EIP-712 clear signing example (v1.6)
- `oseaABI.json` - Seaport contract ABI for calldata example
- `web-interface/src/utils/erc7730-v1.schema.json` - ERC-7730 schema

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ASI AI](https://ai.asi.com/) - For powering intelligent ERC-7730 suggestions
- [ERC-7730 Specification](https://eips.ethereum.org/EIPS/eip-7730)
- [OpenSea Seaport Protocol](https://docs.opensea.io/reference/seaport-overview)
- [Ethereum Community](https://ethereum.org/)

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Join our community discussions
- Check the documentation

---

*Making Web3 transactions human-readable, one clear signing at a time.* 
