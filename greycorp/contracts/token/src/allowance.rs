use crate::storage_types::{AllowanceDataKey, AllowanceValue, DataKey, BALANCE_BUMP_AMOUNT, BALANCE_LIFETIME_THRESHOLD};
use soroban_sdk::{Address, Env};

pub fn read_allowance(e: &Env, from: Address, spender: Address) -> AllowanceValue {
    let key = DataKey::Allowance(AllowanceDataKey { from, spender });
    let allowance = e.storage().temporary().get(&key).unwrap_or(AllowanceValue {
        amount: 0,
        expiration_ledger: 0,
    });

    if allowance.expiration_ledger < e.ledger().sequence() {
        return AllowanceValue {
            amount: 0,
            expiration_ledger: 0,
        };
    }
    e.storage().temporary().extend_ttl(&key, BALANCE_LIFETIME_THRESHOLD, BALANCE_BUMP_AMOUNT);
    allowance
}

pub fn write_allowance(
    e: &Env,
    from: Address,
    spender: Address,
    amount: i128,
    expiration_ledger: u32,
) {
    let key = DataKey::Allowance(AllowanceDataKey { from, spender });
    let allowance = AllowanceValue { amount, expiration_ledger };

    e.storage().temporary().set(&key, &allowance);

    // Set TTL to expiration_ledger if it's shorter than the default bump.
    let live_for = expiration_ledger.saturating_sub(e.ledger().sequence());
    if live_for > 0 && live_for < BALANCE_BUMP_AMOUNT {
        e.storage().temporary().extend_ttl(&key, live_for, live_for);
    } else {
        e.storage().temporary().extend_ttl(&key, BALANCE_LIFETIME_THRESHOLD, BALANCE_BUMP_AMOUNT);
    }
}

pub fn spend_allowance(e: &Env, from: Address, spender: Address, amount: i128) {
    let allowance = read_allowance(e, from.clone(), spender.clone());
    if allowance.amount < amount {
        panic!("insufficient allowance");
    }

    write_allowance(
        e,
        from,
        spender,
        allowance.amount - amount,
        allowance.expiration_ledger,
    );
}
