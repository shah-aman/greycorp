#![cfg(test)]
extern crate std;

use crate::{token, ExcellarTokenizerClient};

use soroban_sdk::{testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation}, Address, BytesN, Env, IntoVal, Symbol};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> token::Client<'a> {
    // Import the token contract WASM
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/greycorp_token_contract.wasm"
    );
    // Register the contract WASM
    let contract_id = e.register_contract_wasm(None, WASM);
    // Create a client for the registered contract
    let client = token::Client::new(e, &contract_id);
    // Initialize the token contract (assuming it has an initialize function like the standard token)
    // Adjust parameters as needed for your token contract's initialize function
    client.initialize(admin, &7, &"name".into_val(e), &"symbol".into_val(e));
    client
}

fn create_tokenizer_contract<'a>(
    e: &Env,
    token_wasm_hash: &BytesN<32>,
    token_a: &Address,
    admin: &Address,
) -> ExcellarTokenizerClient<'a> {
    let tokenizer = ExcellarTokenizerClient::new(
        e,
        &e.register_contract(None, crate::contract::ExcellarTokenizer),
    );
    tokenizer.initialize(token_wasm_hash, token_a, admin);
    tokenizer
}

fn install_token_wasm(e: &Env) -> BytesN<32> {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/greycorp_token_contract.wasm"
    );
    e.deployer().upload_contract_wasm(WASM)
}

#[test]
fn test_multi_user_deposit() {
    let e = Env::default();
    e.mock_all_auths();

    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let user1 = Address::generate(&e);
    let user2 = Address::generate(&e);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    token_usdc.mint(&user1, &40);
    token_usdc.mint(&user2, &70);
    assert_eq!(token_usdc.balance(&user1), 40);
    assert_eq!(token_usdc.balance(&user2), 70);

    tokenizer.deposit(&user1, &10);
    assert_eq!(tokenizer.cash_reserves(), 10);
    assert_eq!(tokenizer.price(), 1);
    assert_eq!(tokenizer.etf_market_value(), 0);

    // assert_eq!(
    //     e.auths(),
    //     [
    //         (
    //             user1.clone(),
    //             tokenizer.address.clone(),
    //             Symbol::short("deposit"),
    //             (&user1, 10_i128).into_val(&e)
    //         ),
    //         (
    //             user1.clone(),
    //             token_usdc.address.clone(),
    //             Symbol::short("transfer"),
    //             (&user1, &tokenizer.address, 10_i128).into_val(&e)
    //         )
    //     ]
    // );

    tokenizer.deposit(&user2, &20);
    assert_eq!(
        e.auths(),
        std::vec![
            (
                user2.clone(),
                AuthorizedInvocation {
                    function: AuthorizedFunction::Contract((
                        tokenizer.address.clone(),
                        Symbol::new(&e, "deposit"),
                        (&user2, 20_i128).into_val(&e)
                    )),
                    sub_invocations: std::vec![
                        AuthorizedInvocation {
                            function: AuthorizedFunction::Contract((
                                token_usdc.address.clone(),
                                Symbol::new(&e, "transfer"),
                                (&user2, &tokenizer.address, 20_i128).into_val(&e)
                            )),
                            sub_invocations: std::vec![]
                        }
                    ]
                }
            )
        ]
    );

    assert_eq!(tokenizer.balance(&user1), 10);
    assert_eq!(tokenizer.balance(&tokenizer.address), 0);
    assert_eq!(token_usdc.balance(&user1), 30);
    assert_eq!(token_usdc.balance(&tokenizer.address), 30);

    assert_eq!(tokenizer.cash_reserves(), 30);
    assert_eq!(tokenizer.price(), 1);
    assert_eq!(tokenizer.etf_market_value(), 0);

    assert_eq!(tokenizer.balance(&user2), 20);
    assert_eq!(tokenizer.balance(&tokenizer.address), 0);
    assert_eq!(token_usdc.balance(&user2), 50);
    assert_eq!(token_usdc.balance(&tokenizer.address), 30);

    tokenizer.withdraw(&user1, &7);
    // assert_eq!(
    //     e.auths(),
    //     [
    //         (
    //             user1.clone(),
    //             tokenizer.address.clone(),
    //             Symbol::short("withdraw"),
    //             (&user1, 7_i128).into_val(&e)
    //         ),
    //         (
    //             user1.clone(),
    //             tokenizer.address.clone(),
    //             Symbol::short("transfer"),
    //             (&user1, &tokenizer.address, 7_i128).into_val(&e)
    //         )
    //     ]
    // );

    assert_eq!(token_usdc.balance(&user1), 37);
    assert_eq!(tokenizer.balance(&user1), 3);
    assert_eq!(token_usdc.balance(&user2), 50);
    assert_eq!(tokenizer.balance(&user2), 20);
    assert_eq!(token_usdc.balance(&tokenizer.address), 23);
    assert_eq!(tokenizer.balance(&tokenizer.address), 0);
    assert_eq!(tokenizer.cash_reserves(), 23);
    assert_eq!(tokenizer.price(), 1);
    assert_eq!(tokenizer.etf_market_value(), 0);
}

#[test]
fn admin_withdraw_works() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    tokenizer.set_etf_market_value(&100);
}

#[test]
fn test_set_get_etf_market_value() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    tokenizer.set_etf_market_value(&100);
    assert_eq!(tokenizer.etf_market_value(), 100);
}

#[test]
fn test_set_cash_reserves() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    tokenizer.set_cash_reserves(&100);
    assert_eq!(tokenizer.cash_reserves(), 100);
}

#[test]
fn test_set_fees() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    tokenizer.set_etf_market_value(&200);
    tokenizer.set_fees(&100);
    assert_eq!(tokenizer.fees(), 100);
}

#[test]
fn test_withdraw_admin() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    let user1 = Address::generate(&e);

    token_usdc.mint(&user1, &40);
    tokenizer.deposit(&user1, &10);

    tokenizer.withdraw_admin(&admin1, &10);
    assert_eq!(tokenizer.balance(&user1), 10);
    assert_eq!(tokenizer.balance(&tokenizer.address), 0);
    assert_eq!(tokenizer.cash_reserves(), 10);
    assert_eq!(tokenizer.total(), 10);
    assert_eq!(tokenizer.fees(), 0);
    assert_eq!(tokenizer.etf_market_value(), 0);
    assert_eq!(tokenizer.price(), 1);
    assert_eq!(token_usdc.balance(&user1), 30);
    assert_eq!(token_usdc.balance(&tokenizer.address), 0);
}

#[test]
fn test_price_change() {
    let e = Env::default();
    e.mock_all_auths();
    let admin1 = Address::generate(&e);
    let token_usdc = create_token_contract(&e, &admin1);
    let tokenizer =
        create_tokenizer_contract(&e, &install_token_wasm(&e), &token_usdc.address, &admin1);

    let user1 = Address::generate(&e);

    token_usdc.mint(&user1, &100);
    tokenizer.deposit(&user1, &100);

    tokenizer.set_etf_market_value(&150);
    tokenizer.set_cash_reserves(&50);
    tokenizer.set_fees(&10);
    assert_eq!(tokenizer.cash_reserves(), 50);
    assert_eq!(tokenizer.total(), 100);
    assert_eq!(tokenizer.fees(), 10);
    assert_eq!(tokenizer.etf_market_value(), 150);
    // (150 + 50 - 10) / 100 = 1.9 = 1 because of no-std rounding
    assert_eq!(tokenizer.price(), 1);
}
