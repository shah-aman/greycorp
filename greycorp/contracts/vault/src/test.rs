#![cfg(test)]
extern crate std;

use soroban_sdk::{testutils::Address as _, token, Address, Bytes, Env};

use crate::{storage::DataKey, VaultContract, VaultContractClient};

// Helper function to create and initialize the vault contract
fn create_vault_contract<'a>(
    e: &Env,
    admin: &Address,
    relayer: &Address,
    xusg_token: &Address,
) -> VaultContractClient<'a> {
    let vault_id = e.register_contract(None, VaultContract {});
    let vault_client = VaultContractClient::new(e, &vault_id);
    vault_client.initialize(admin, relayer, xusg_token);
    vault_client
}

// Helper function to create a standard token contract for testing XUSG
fn create_token_contract<'a>(e: &Env, admin: &Address) -> (Address, token::Client<'a>) {
    let contract_address = e.register_stellar_asset_contract(admin.clone());
    let client = token::Client::new(e, &contract_address);
    (contract_address, client)
}

#[test]
fn test_vault_flow() {
    let e = Env::default();
    e.mock_all_auths();

    // Setup identities
    let admin = Address::generate(&e);
    let relayer = Address::generate(&e);
    let user_stellar_addr = Address::generate(&e); // Where user will claim funds
    let external_user_id = Bytes::from_slice(&e, b"user_solana_address_123"); // Example ID

    // Setup XUSG token contract (mocked)
    let (xusg_token_id, xusg_token_client) = create_token_contract(&e, &admin);

    // Setup Vault contract
    let vault_client = create_vault_contract(&e, &admin, &relayer, &xusg_token_id);
    let vault_id = vault_client.address.clone();

    // --- Simulate Relayer Action --- 
    // 1. Mint XUSG to the vault address (simulates tokenizer call)
    xusg_token_client.mint(&vault_id, &1000);
    assert_eq!(xusg_token_client.balance(&vault_id), 1000);

    // 2. Credit the balance in the vault's map
    vault_client
        .with_source_account(&relayer)
        .credit_balance(&external_user_id, &1000);

    // Check mapped balance
    assert_eq!(vault_client.get_balance(&external_user_id), 1000);

    // --- Simulate Claim Action --- 
    // User (via Relayer for MVP) claims 600 XUSG
    vault_client
        .with_source_account(&relayer)
        .claim(&external_user_id, &user_stellar_addr, &600);

    // Verify balances
    assert_eq!(vault_client.get_balance(&external_user_id), 400); // Mapped balance decreased
    assert_eq!(xusg_token_client.balance(&vault_id), 400); // Vault's actual XUSG decreased
    assert_eq!(xusg_token_client.balance(&user_stellar_addr), 600); // User received XUSG

    // --- Test Insufficient Balance --- 
    // Try to claim more than available
    let result = vault_client
        .with_source_account(&relayer)
        .try_claim(&external_user_id, &user_stellar_addr, &500);
    assert!(result.is_err()); // Should fail

    // Verify balances didn't change from failed claim
    assert_eq!(vault_client.get_balance(&external_user_id), 400);
    assert_eq!(xusg_token_client.balance(&vault_id), 400);
    assert_eq!(xusg_token_client.balance(&user_stellar_addr), 600);
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_initialize_already_initialized() {
    let e = Env::default();
    let admin = Address::generate(&e);
    let relayer = Address::generate(&e);
    let (xusg_token_id, _) = create_token_contract(&e, &admin);
    let vault_client = create_vault_contract(&e, &admin, &relayer, &xusg_token_id);
    // Try initializing again
    vault_client.initialize(&admin, &relayer, &xusg_token_id);
}
