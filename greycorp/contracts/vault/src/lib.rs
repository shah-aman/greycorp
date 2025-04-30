#![no_std]

use soroban_sdk::{
    contract, contractimpl, Address, Bytes, Env, Map,
    token::Client, // Use the standard token client interface
};

// Import storage functions
mod storage;
use storage::*;

// Define the contract interface
pub trait VaultTrait {
    // Initializes the vault contract
    fn initialize(e: Env, admin: Address, relayer: Address, xusg_token: Address);

    // Allows admin to change the relayer address
    fn set_relayer(e: Env, new_relayer: Address);

    // Called by the relayer to credit a user's virtual balance
    // external_id: Bytes representation of the user's source chain address
    fn credit_balance(e: Env, external_id: Bytes, amount: i128);

    // Called by the relayer (for MVP) to transfer funds from the vault to a user's Stellar address
    fn claim(e: Env, external_id: Bytes, destination: Address, amount: i128);

    // Read-only function to check the virtual balance for an external ID
    fn get_balance(e: Env, external_id: Bytes) -> i128;
}

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultTrait for VaultContract {
    fn initialize(e: Env, admin: Address, relayer: Address, xusg_token: Address) {
        // Prevent re-initialization
        if has_administrator(&e) {
            panic!("Already initialized");
        }
        write_administrator(&e, &admin);
        write_relayer(&e, &relayer);
        write_xusg_token(&e, &xusg_token);
        // Initialize balances map implicitly when first written to
    }

    fn set_relayer(e: Env, new_relayer: Address) {
        require_admin(&e); // Only admin can change the relayer
        write_relayer(&e, &new_relayer);
    }

    fn credit_balance(e: Env, external_id: Bytes, amount: i128) {
        require_relayer(&e); // Only the authorized relayer can credit balances

        if amount <= 0 {
            panic!("Credit amount must be positive");
        }

        let current_balance = read_balance(&e, &external_id);
        let new_balance = current_balance + amount;
        write_balance(&e, &external_id, &new_balance);
        // Note: This assumes the actual XUSG tokens were already sent to this vault
        // contract's address by the relayer calling tokenizer.relay_mint
    }

    fn claim(e: Env, external_id: Bytes, destination: Address, amount: i128) {
        require_relayer(&e); // MVP: Only relayer can authorize claim
        // TODO (Post-MVP): Implement user signature verification here?

        if amount <= 0 {
            panic!("Claim amount must be positive");
        }

        let current_balance = read_balance(&e, &external_id);

        if current_balance < amount {
            panic!("Insufficient mapped balance");
        }

        let new_balance = current_balance - amount;
        write_balance(&e, &external_id, &new_balance);

        // Transfer the actual XUSG from this vault contract to the destination
        let xusg_token_id = read_xusg_token(&e);
        let client = Client::new(&e, &xusg_token_id);
        client.transfer(&e.current_contract_address(), &destination, &amount);
    }

    fn get_balance(e: Env, external_id: Bytes) -> i128 {
        read_balance(&e, &external_id)
    }
}
