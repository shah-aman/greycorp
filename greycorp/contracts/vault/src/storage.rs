use soroban_sdk::{contracttype, Address, Bytes, ConversionError, Env, Map, TryFromVal, Val};

// --- Data Keys ---
#[derive(Clone, Copy)]
#[contracttype]
pub enum DataKey {
    Admin,
    Relayer,
    XusgToken,
    Balances, // Map<Bytes (ExternalID), i128 (Balance)>
}

// --- Admin Functions ---
pub fn has_administrator(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Admin)
}

pub fn read_administrator(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn write_administrator(e: &Env, id: &Address) {
    e.storage().instance().set(&DataKey::Admin, id);
}

pub fn require_admin(e: &Env) {
    read_administrator(e).require_auth();
}

// --- Relayer Functions ---
pub fn read_relayer(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::Relayer).unwrap()
}

pub fn write_relayer(e: &Env, id: &Address) {
    e.storage().instance().set(&DataKey::Relayer, id);
}

pub fn require_relayer(e: &Env) {
    read_relayer(e).require_auth();
}

// --- XUSG Token Functions ---
pub fn read_xusg_token(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::XusgToken).unwrap()
}

pub fn write_xusg_token(e: &Env, id: &Address) {
    e.storage().instance().set(&DataKey::XusgToken, id);
}

// --- Balance Map Functions ---

// Helper to get the balance map, initializes if it doesn't exist
fn get_balance_map(e: &Env) -> Map<Bytes, i128> {
    e.storage()
        .instance()
        .get(&DataKey::Balances)
        .unwrap_or_else(|| Map::new(e))
}

// Reads the balance for a specific external ID
pub fn read_balance(e: &Env, external_id: &Bytes) -> i128 {
    let balances = get_balance_map(e);
    balances.get(external_id.clone()).unwrap_or(0)
}

// Writes the balance for a specific external ID
pub fn write_balance(e: &Env, external_id: &Bytes, amount: &i128) {
    let mut balances = get_balance_map(e);
    balances.set(external_id.clone(), *amount);
    e.storage().instance().set(&DataKey::Balances, &balances);
}
