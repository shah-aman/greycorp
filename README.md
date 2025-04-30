# GreyCorp: T-Bill Tokenization on Soroban with Cross-Chain Access

![GreyCorp Logo](https://greycorp.finance/logo.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/Soroban-compatible-blue.svg)](https://soroban.stellar.org/)

## 📖 Overview

GreyCorp is a DeFi tokenization platform built on Stellar's Soroban smart contract platform that enables users to access real-world yields from T-bill ETFs. The platform allows users to deposit stablecoins (USDC) and receive tokenized shares (XUSG) that represent ownership in a T-bill fund, with seamless cross-chain functionality.

### Key Features

- 🔄 **T-Bill Tokenization**: Convert USDC to tokenized T-bills (XUSG) backed by real-world assets
- 🌐 **Cross-Chain Access**: Deposit from and withdraw to multiple blockchains (Solana, Ethereum, etc.)
- 🔍 **Transparent Asset Backing**: Full visibility into cash reserves, ETF market value, and fees
- 🛡️ **Secure Architecture**: Multi-contract design with proper authorization checks
- 📱 **User-Friendly**: Simple deposit and withdrawal process with planned mobile support

## 🏗️ Architecture

GreyCorp consists of three main Rust crates managed with Cargo:

1. **Token Crate (`greycorp-token-contract`)**: Standard Soroban token implementation for XUSG
2. **Tokenizer Crate (`greycorp-tokenizer-contract`)**: Core business logic for deposits, withdrawals, and price calculations
3. **Deploy Crate (`greycorp-deploy`)**: CLI tool for deploying contracts to Soroban networks
4. **Vault Crate**: Manages cross-chain balances and claims

Additionally, it incorporates:

- **Relayer Backend**: Off-chain service that facilitates cross-chain transactions
- **Temporary Account System**: Creates unique accounts for cross-chain deposits

## 📋 Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (1.70 or newer)
- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- Access to a Stellar network (testnet/mainnet) or Soroban sandbox

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/greycorp/greycorp-contracts.git
cd greycorp-contracts
```

### Build the Contracts

```bash
# Build all contracts
cargo build --release

# Build individual contracts
cd token
cargo build --release
cd ../tokenizer
cargo build --release
cd ../vault
cargo build --release
```

### Build the WASM Files

```bash
# From the project root
cargo run --package greycorp-build -- --all

# Build specific contracts
cargo run --package greycorp-build -- --contract token
cargo run --package greycorp-build -- --contract tokenizer
cargo run --package greycorp-build -- --contract vault
```

## 🛠️ Deployment

### Local Sandbox Deployment

```bash
# Deploy the token contract
cargo run --package greycorp-deploy -- \
  --wasm target/wasm32-unknown-unknown/release/greycorp_token_contract.wasm \
  --network sandbox \
  --source-account ADMIN_SECRET_KEY

# Deploy the tokenizer contract
cargo run --package greycorp-deploy -- \
  --wasm target/wasm32-unknown-unknown/release/greycorp_tokenizer_contract.wasm \
  --network sandbox \
  --source-account ADMIN_SECRET_KEY \
  --token-wasm-hash TOKEN_WASM_HASH \
  --usdc-address USDC_CONTRACT_ADDRESS

# Deploy the vault contract
cargo run --package greycorp-deploy -- \
  --wasm target/wasm32-unknown-unknown/release/greycorp_vault_contract.wasm \
  --network sandbox \
  --source-account ADMIN_SECRET_KEY
```

### Testnet/Mainnet Deployment

```bash
# Deploy to Testnet
cargo run --package greycorp-deploy -- \
  --wasm target/wasm32-unknown-unknown/release/greycorp_tokenizer_contract.wasm \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  --source-account ADMIN_SECRET_KEY

# Deploy to Mainnet (when ready)
cargo run --package greycorp-deploy -- \
  --wasm target/wasm32-unknown-unknown/release/greycorp_tokenizer_contract.wasm \
  --network mainnet \
  --rpc-url https://soroban-rpc.stellar.org \
  --network-passphrase "Public Global Stellar Network ; September 2015" \
  --source-account ADMIN_SECRET_KEY
```

## 📝 Usage

### Initializing the Contracts

```bash
# Initialize the tokenizer contract
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  initialize \
  --token_wasm_hash TOKEN_WASM_HASH \
  --token_usdc USDC_CONTRACT_ADDRESS \
  --admin ADMIN_PUBLIC_KEY

# Set the relayer
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  set_relayer \
  --relayer RELAYER_PUBLIC_KEY

# Initialize the vault contract
soroban contract invoke \
  --id VAULT_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  initialize \
  --admin ADMIN_PUBLIC_KEY \
  --relayer RELAYER_PUBLIC_KEY \
  --xusg_token XUSG_CONTRACT_ADDRESS
```

### User Operations

#### Depositing USDC

```bash
# Approve USDC allowance
soroban contract invoke \
  --id USDC_CONTRACT_ADDRESS \
  --source-account USER_SECRET_KEY \
  -- \
  approve \
  --from USER_PUBLIC_KEY \
  --spender TOKENIZER_CONTRACT_ID \
  --amount 1000000000 \
  --expiration_ledger 0

# Deposit USDC and receive XUSG
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account USER_SECRET_KEY \
  -- \
  deposit \
  --to USER_PUBLIC_KEY \
  --usdc_amount 1000000000
```

#### Withdrawing USDC

```bash
# Approve XUSG allowance
soroban contract invoke \
  --id XUSG_CONTRACT_ADDRESS \
  --source-account USER_SECRET_KEY \
  -- \
  approve \
  --from USER_PUBLIC_KEY \
  --spender TOKENIZER_CONTRACT_ID \
  --amount 1000000000 \
  --expiration_ledger 0

# Withdraw XUSG and receive USDC
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account USER_SECRET_KEY \
  -- \
  withdraw \
  --to USER_PUBLIC_KEY \
  --xusg_amount 1000000000
```

### Admin Operations

```bash
# Update ETF Market Value
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  set_etf_market_value \
  --value 10150000000

# Update Cash Reserves
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  set_cash_reserves \
  --amount 5000000000

# Withdraw USDC (Admin)
soroban contract invoke \
  --id TOKENIZER_CONTRACT_ID \
  --source-account ADMIN_SECRET_KEY \
  -- \
  withdraw_admin \
  --to ADMIN_PUBLIC_KEY \
  --usdc_amount 1000000000
```

## 🌉 Cross-Chain Functionality

GreyCorp uses a relayer system to enable cross-chain deposits and withdrawals. For developers looking to integrate with or customize the cross-chain functionality:

### Setting Up the Relayer

1. Clone the GreyCorp relayer repository:
   ```bash
   git clone https://github.com/greycorp/greycorp-relayer.git
   cd greycorp-relayer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the relayer:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. Start the relayer service:
   ```bash
   npm start
   ```

### Cross-Chain Deposit Flow

1. User initiates a deposit from an external chain
2. Relayer creates a temporary account on the source chain
3. User sends funds to the temporary account
4. Relayer detects the payment and calls `relay_mint` on the tokenizer
5. Relayer credits the user's virtual balance in the vault

### Cross-Chain Withdrawal Flow

1. User initiates a withdrawal to an external chain
2. Relayer calls `claim` on the vault contract
3. Vault transfers XUSG to the relayer
4. Relayer sends the equivalent amount on the target chain to the user

## 🧪 Testing

### Running Contract Tests

```bash
# Run all tests
cargo test

# Run specific contract tests
cargo test --package greycorp-token-contract
cargo test --package greycorp-tokenizer-contract
cargo test --package greycorp-vault-contract
```

### Running Integration Tests

```bash
# Run integration tests with a local sandbox
cargo test --package greycorp-integration-tests
```

## 📊 Technical Flow Examples

### Deposit Flow

1. User deposits 100 USDC
2. Contract calculates XUSG price (e.g., $1.00)
3. Contract mints 100 XUSG to the user
4. `cash_reserves` increases by 100 USDC
5. `total_xusg` increases by 100 XUSG

### ETF Purchase (Admin Operation)

1. Admin withdraws 100 USDC
2. Admin purchases T-bill ETF off-chain
3. Admin updates `etf_market_value` to reflect purchase
4. XUSG price updates accordingly

### Price Calculation

XUSG Price = (etf_market_value + cash_reserves - fees) / total_xusg

## 📋 Code Structure

```
greycorp-contracts/
├── .github/            # GitHub workflows
├── token/              # XUSG token contract
│   ├── src/
│   │   ├── lib.rs      # Contract implementation
│   │   ├── admin.rs    # Admin functionality
│   │   ├── balance.rs  # Balance management
│   │   └── ...
│   └── Cargo.toml
├── tokenizer/          # Tokenizer contract
│   ├── src/
│   │   ├── lib.rs      # Contract implementation
│   │   ├── error.rs    # Error definitions
│   │   ├── storage.rs  # Storage functions
│   │   ├── token.rs    # Token interaction
│   │   └── utils.rs    # Utility functions
│   └── Cargo.toml
├── vault/              # Vault contract for cross-chain
│   ├── src/
│   │   ├── lib.rs      # Contract implementation
│   │   └── storage.rs  # Storage functions
│   └── Cargo.toml
├── deploy/             # Deployment CLI tool
│   ├── src/
│   │   ├── main.rs     # CLI entry point
│   │   └── upload.rs   # WASM upload functionality
│   └── Cargo.toml
└── Cargo.toml          # Workspace configuration
```

## 🤝 Contributing

We welcome contributions to GreyCorp! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

Please make sure to update tests as appropriate and adhere to the code style guidelines.

## 🔒 Security

If you discover a security vulnerability within GreyCorp, please send an email to security@greycorp.finance. All security vulnerabilities will be promptly addressed.

## 📄 License

GreyCorp is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Website: [greycorp.finance](https://greycorp.finance)
- Email: team@greycorp.finance
- Twitter: [@GreyCorpFinance](https://twitter.com/GreyCorpFinance)
- Discord: [GreyCorp Community](https://discord.gg/greycorp)

---

Built with ❤️ by the GreyCorp team
