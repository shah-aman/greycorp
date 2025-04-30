#!/bin/bash

# Stop script on first error and enable tracing
set -e
set -o pipefail

# --- Configuration ---
NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Key file paths
KEY_DIR="./.stellar/keys"
DEPLOYER_KEY="deployer"
ADMIN_KEY="admin"
RELAYER_KEY="relayer"
USER_KEY="user"

# Contract aliases - using fixed names for easier reference
TOKEN_ALIAS="usdc-token-mvp"
TOKENIZER_ALIAS="tokenizer-mvp"
VAULT_ALIAS="vault-mvp"

# Package names - must match Cargo.toml
TOKEN_PACKAGE="greycorp_token_contract"
TOKENIZER_PACKAGE="greycorp_tokenizer_contract"
VAULT_PACKAGE="greycorp_vault_contract"

# --- Utility Functions ---
log_step() {
  echo
  echo "==============================================="
  echo "  $1"
  echo "==============================================="
}

log_info() {
  echo "→ $1"
}

log_success() {
  echo "✓ $1"
}

log_error() {
  echo "✗ ERROR: $1" >&2
}

# Create key directory if it doesn't exist
mkdir -p "$KEY_DIR"

# Function to verify account exists and has funds
check_account() {
  local name=$1
  
  log_info "Checking $name account..."
  
  # Get public key
  local public_key=$(stellar keys address "$name")
  
  if [ -z "$public_key" ]; then
    log_error "$name identity not found."
    return 1
  fi
  
  echo "Public Key: $public_key"
  log_success "$name identity verified"
  return 0
}

# Handle contract invocation with better error messaging
invoke_contract() {
  local contract_id=$1
  local identity=$2
  local method=$3
  shift 3
  
  log_info "Invoking $method on contract $contract_id..."
  
  if ! stellar contract invoke \
    --id "$contract_id" \
    --source "$identity" \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE" \
    -- \
    "$method" "$@"; then
    
    log_error "Failed to invoke $method on contract $contract_id"
    return 1
  fi
  
  log_success "Successfully invoked $method"
  return 0
}

# Function to read contract state
read_contract() {
  local contract_id=$1
  local method=$2
  shift 2
  
  stellar contract read \
    --id "$contract_id" \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE" \
    -- \
    "$method" "$@"
}

# --- Account Generation ---
log_step "Setting up Accounts"

generate_identity() {
  local name=$1
  
  # Check if identity already exists
  if stellar keys address "$name" &>/dev/null; then
    log_info "Identity $name already exists. Retrieving public key..."
    local pk=$(stellar keys address "$name")
    echo "Public Key: $pk"
    return 0
  fi
  
  log_info "Generating identity $name..."
  if ! stellar keys generate "$name"; then
    log_error "Failed to generate identity $name"
    return 1
  fi
  
  local pk=$(stellar keys address "$name")
  log_success "Generated identity $name"
  echo "Public Key: $pk"
  
  return 0
}

generate_identity "$DEPLOYER_KEY"
generate_identity "$ADMIN_KEY"
generate_identity "$RELAYER_KEY"
generate_identity "$USER_KEY"

DEPLOYER_PK=$(stellar keys address "$DEPLOYER_KEY")
ADMIN_PK=$(stellar keys address "$ADMIN_KEY")
RELAYER_PK=$(stellar keys address "$RELAYER_KEY")
USER_PK=$(stellar keys address "$USER_KEY")

log_step "ACCOUNTS TO FUND"
echo "Please fund the following accounts using Friendbot:"
echo "Deployer: $DEPLOYER_PK"
echo "Admin:    $ADMIN_PK"
echo "Relayer:  $RELAYER_PK"
echo "User:     $USER_PK"
echo "Friendbot URL: https://friendbot.stellar.org/"

# Offer to automatically fund accounts
read -p "Would you like to automatically fund these accounts using Friendbot? (y/n): " auto_fund
if [[ "$auto_fund" == "y" || "$auto_fund" == "Y" ]]; then
  log_info "Funding accounts with Friendbot..."
  
  for acct in "$DEPLOYER_PK" "$ADMIN_PK" "$RELAYER_PK" "$USER_PK"; do
    log_info "Funding $acct..."
    curl -s "https://friendbot.stellar.org/?addr=$acct"
    echo
  done
  
  log_success "Funding requests sent. Please verify account balances."
else
  log_info "Please fund accounts manually and press Enter when finished."
  read -p "Press Enter once all accounts are funded..."
fi

# Verify accounts exist
check_account "$DEPLOYER_KEY" || exit 1
check_account "$ADMIN_KEY" || exit 1
check_account "$RELAYER_KEY" || exit 1
check_account "$USER_KEY" || exit 1

# --- Build Contracts ---
log_step "Building Contracts"

log_info "Building all contracts using cargo..."
if ! cargo build --release --target wasm32-unknown-unknown; then
  log_error "Failed to build contracts with cargo"
  exit 1
fi

# Optimize the WASM files if soroban-cli is available
if command -v stellar >/dev/null 2>&1; then
  log_info "Optimizing WASM files..."
  mkdir -p target/wasm32-unknown-unknown/release/optimized
  
  for contract in "$TOKEN_PACKAGE" "$TOKENIZER_PACKAGE" "$VAULT_PACKAGE"; do
    if [ -f "target/wasm32-unknown-unknown/release/$contract.wasm" ]; then
      log_info "Optimizing $contract..."
      stellar contract optimize \
        --wasm "target/wasm32-unknown-unknown/release/$contract.wasm" \
        --output "target/wasm32-unknown-unknown/release/optimized/$contract.wasm"
    else
      log_error "Could not find WASM file for $contract"
      exit 1
    fi
  done
fi

log_success "Contracts built successfully"

# --- Deploy Contracts ---
log_step "Deploying Contracts"

# Deploy Token Contract
log_info "Deploying Token Contract ($TOKEN_ALIAS)..."
USDC_TOKEN_ID=$(stellar contract deploy \
  --wasm "target/wasm32-unknown-unknown/release/$TOKEN_PACKAGE.wasm" \
  --source-account "$DEPLOYER_KEY" \
  --network "$NETWORK" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE")

if [ -z "$USDC_TOKEN_ID" ]; then
  log_error "Failed to deploy Token Contract"
  exit 1
fi

log_success "Token Contract ID: $USDC_TOKEN_ID"

# Deploy Tokenizer Contract
log_info "Deploying Tokenizer Contract ($TOKENIZER_ALIAS)..."
TOKENIZER_ID=$(stellar contract deploy \
  --wasm "target/wasm32-unknown-unknown/release/$TOKENIZER_PACKAGE.wasm" \
  --source-account "$DEPLOYER_KEY" \
  --network "$NETWORK" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE")

if [ -z "$TOKENIZER_ID" ]; then
  log_error "Failed to deploy Tokenizer Contract"
  exit 1
fi

log_success "Tokenizer Contract ID: $TOKENIZER_ID"

# Deploy Vault Contract
log_info "Deploying Vault Contract ($VAULT_ALIAS)..."
VAULT_ID=$(stellar contract deploy \
  --wasm "target/wasm32-unknown-unknown/release/$VAULT_PACKAGE.wasm" \
  --source-account "$DEPLOYER_KEY" \
  --network "$NETWORK" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE")

if [ -z "$VAULT_ID" ]; then
  log_error "Failed to deploy Vault Contract"
  exit 1
fi

log_success "Vault Contract ID: $VAULT_ID"

# --- Verify Contract Deployment ---
log_step "Verifying Contract Deployment"

for contract_id in "$USDC_TOKEN_ID" "$TOKENIZER_ID" "$VAULT_ID"; do
  log_info "Inspecting contract $contract_id..."
  stellar contract inspect --id "$contract_id" --network "$NETWORK" --rpc-url "$RPC_URL" || {
    log_error "Failed to verify contract $contract_id"
    exit 1
  }
done

# --- Get Token WASM Hash ---
log_step "Obtaining Token WASM Hash"

TOKEN_WASM_HASH=$(stellar contract hash \
  --wasm "target/wasm32-unknown-unknown/release/$TOKEN_PACKAGE.wasm")

if [ -z "$TOKEN_WASM_HASH" ]; then
  log_error "Failed to get token WASM hash"
  exit 1
fi

log_success "Token WASM Hash: $TOKEN_WASM_HASH"

# --- Initialize Contracts ---
log_step "Initializing Contracts"

# Initialize Tokenizer
log_info "Initializing Tokenizer ($TOKENIZER_ALIAS)..."
invoke_contract "$TOKENIZER_ID" "$ADMIN_KEY" "initialize" \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_usdc "$USDC_TOKEN_ID" \
  --admin "$ADMIN_PK" || exit 1

# Initialize Vault
log_info "Initializing Vault ($VAULT_ALIAS)..."
invoke_contract "$VAULT_ID" "$ADMIN_KEY" "initialize" \
  --admin "$ADMIN_PK" \
  --relayer "$RELAYER_PK" \
  --xusg_token "$TOKENIZER_ID" || exit 1  # XUSG token is the tokenizer contract itself

# --- Set Relayer Permissions ---
log_step "Setting Relayer Permissions (Admin Action)"

# Set Relayer in Tokenizer
log_info "Setting Relayer ($RELAYER_PK) in Tokenizer ($TOKENIZER_ALIAS)..."
invoke_contract "$TOKENIZER_ID" "$ADMIN_KEY" "set_relayer" \
  --relayer "$RELAYER_PK" || exit 1

# --- Simulate Relayer Actions ---
log_step "Simulating Relayer Actions"

AMOUNT_TO_MINT=5000000000 # Example: 500 XUSG (assuming 7 decimals like standard token)
EXTERNAL_ID_STR="solana_devnet_user_1" # Example external ID string
# More robust hex conversion for Bytes argument
EXTERNAL_ID_HEX=$(echo -n "$EXTERNAL_ID_STR" | hexdump -v -e '/1 "%02x"')

# 1. Relayer calls tokenizer.relay_mint to send XUSG to Vault
log_info "Relayer ($RELAYER_PK) minting $AMOUNT_TO_MINT XUSG to Vault ($VAULT_ID)..."
invoke_contract "$TOKENIZER_ID" "$RELAYER_KEY" "relay_mint" \
  --recipient "$VAULT_ID" \
  --amount "$AMOUNT_TO_MINT" || exit 1

# 2. Relayer calls vault.credit_balance to map funds
log_info "Relayer crediting balance for External ID ($EXTERNAL_ID_STR)..."
invoke_contract "$VAULT_ID" "$RELAYER_KEY" "credit_balance" \
  --external_id "$EXTERNAL_ID_HEX" \
  --amount "$AMOUNT_TO_MINT" || exit 1

# --- Verify Initial State ---
log_step "Verifying State After Deposit"

log_info "Vault's XUSG Balance (Actual):"
read_contract "$TOKENIZER_ID" "balance" --addr "$VAULT_ID"

log_info "Mapped Balance for External ID ($EXTERNAL_ID_STR) in Vault:"
read_contract "$VAULT_ID" "get_balance" --external_id "$EXTERNAL_ID_HEX"

# --- Simulate Claim Action ---
log_step "Simulating Claim Action"

AMOUNT_TO_CLAIM=2000000000 # Example: 200 XUSG

log_info "Relayer claiming $AMOUNT_TO_CLAIM XUSG for External ID ($EXTERNAL_ID_STR) to User ($USER_PK)..."
invoke_contract "$VAULT_ID" "$RELAYER_KEY" "claim" \
  --external_id "$EXTERNAL_ID_HEX" \
  --destination "$USER_PK" \
  --amount "$AMOUNT_TO_CLAIM" || exit 1

# --- Verify Final State ---
log_step "Verifying State After Claim"

log_info "Vault's XUSG Balance (Actual):"
read_contract "$TOKENIZER_ID" "balance" --addr "$VAULT_ID"

log_info "Mapped Balance for External ID ($EXTERNAL_ID_STR) in Vault:"
read_contract "$VAULT_ID" "get_balance" --external_id "$EXTERNAL_ID_HEX"

log_info "User's XUSG Balance ($USER_PK):"
read_contract "$TOKENIZER_ID" "balance" --addr "$USER_PK"

log_step "Script Finished Successfully"
echo "All contracts deployed and operations completed."
echo 
echo "Contract IDs:"
echo "Token:      $USDC_TOKEN_ID"
echo "Tokenizer:  $TOKENIZER_ID"
echo "Vault:      $VAULT_ID"