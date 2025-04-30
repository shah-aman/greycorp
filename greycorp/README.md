# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:

```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.

ℹ️ Simulating install transaction…
ℹ️ Signing transaction: c9a853af28b3423f650e024e2af9074490822e237803d0356b035b9749569473
🌎 Submitting install transaction…
ℹ️ Using wasm hash d45901b7981615cab6af556e9548b8e456fc25d702ec35febe0fc2e05a71d3ff
ℹ️ Simulating deploy transaction…
ℹ️ Transaction hash is b38c6689de9276020f3f9d64e29a95afaff5d97c03b0d4583682ee0a1351ff07
🔗 https://stellar.expert/explorer/testnet/tx/b38c6689de9276020f3f9d64e29a95afaff5d97c03b0d4583682ee0a1351ff07
ℹ️ Signing transaction: b38c6689de9276020f3f9d64e29a95afaff5d97c03b0d4583682ee0a1351ff07
🌎 Submitting deploy transaction…
🔗 https://stellar.expert/explorer/testnet/contract/CBMUFQQCKW2V4HRHEKMQ2X2QWK6L3X7JJ2ULJRG3BAQZBLTFIFBSAVP3
✅ Deployed!
CBMUFQQCKW2V4HRHEKMQ2X2QWK6L3X7JJ2ULJRG3BAQZBLTFIFBSAVP3

+++++
token contract
ℹ️ Simulating install transaction…
ℹ️ Signing transaction: f1c0c31944812a983b17060b2a097af3bdf83a081b4cf404cc1f2a61923b49c6
🌎 Submitting install transaction…
ℹ️ Using wasm hash f3a586d9b29d4806bf77d132852ba7e53b2fae0ccfac7804993ab0e91b78658d
ℹ️ Simulating deploy transaction…
ℹ️ Transaction hash is c7757eb62501910698cad8212fc525713ea27385b0f5452d9b5a2045c36b7257
🔗 https://stellar.expert/explorer/testnet/tx/c7757eb62501910698cad8212fc525713ea27385b0f5452d9b5a2045c36b7257
ℹ️ Signing transaction: c7757eb62501910698cad8212fc525713ea27385b0f5452d9b5a2045c36b7257
🌎 Submitting deploy transaction…
🔗 https://stellar.expert/explorer/testnet/contract/CDTALAZ6OJ4MLGFD4NFCUGVJA2YMOWI5YV6OMJ6TVIXYEP7CGZZCBRJL
✅ Deployed!
CDTALAZ6OJ4MLGFD4NFCUGVJA2YMOWI5YV6OMJ6TVIXYEP7CGZZCBRJL

intiailse transaction hash = 6564264dcd97b5031f09d6a300f03b2a549e1b357f2984f6d127ade0b7668287
