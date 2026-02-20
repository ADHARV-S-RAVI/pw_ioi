import os
from dotenv import load_dotenv, set_key
from algosdk import mnemonic, account
from algosdk.v2client import algod
from beaker import Application, client
from contracts.app import app

# Load current .env
load_dotenv()

def deploy_testnet(existing_app_id=None):
    # TESTNET SETTINGS (AlgoNode public node)
    ALGOD_SERVER = "https://testnet-api.algonode.cloud"
    ALGOD_PORT = ""
    ALGOD_TOKEN = ""
    
    # Get Mnemonic from .env
    MNEMONIC = os.getenv("DEPLOYER_MNEMONIC")
    if not MNEMONIC:
        print("ERROR: DEPLOYER_MNEMONIC not found in .env")
        return

    # Initialize client
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_SERVER)
    
    # Derive account
    private_key = mnemonic.to_private_key(MNEMONIC)
    address = account.address_from_private_key(private_key)
    
    print(f"Deploying with address: {address}")
    
    # Check balance
    acct_info = algod_client.account_info(address)
    if acct_info['amount'] < 1000000: # Need at least 1 ALGO
        print(f"ERROR: Insufficient balance ({acct_info['amount']} microAlgos). Please fund at https://bank.testnet.algorand.network/")
        return

    # 1. Build & Deploy Application
    from algosdk.atomic_transaction_composer import AccountTransactionSigner
    import time
    
    # Build without client to avoid rate limiting on source map generation
    app_spec = app.build() 
    
    app_client = client.ApplicationClient(
        client=algod_client,
        app=app_spec, 
        signer=AccountTransactionSigner(private_key),
        app_id=existing_app_id if existing_app_id else 0
    )
    
    def call_with_retry(func, *args, **kwargs):
        for i in range(5):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                # Catch both direct 429 and AlgodHTTPError
                if ("429" in str(e) or "Too Many Requests" in str(e)) and i < 4:
                    wait = 2**(i+1)
                    print(f"Rate limited (429). Retrying in {wait}s...")
                    time.sleep(wait)
                    continue
                raise e

    if not existing_app_id:
        app_id, app_address, transaction_id = call_with_retry(app_client.create)
        print(f"Testnet App Deployed! ID: {app_id}")
    else:
        app_id = existing_app_id
        print(f"Using existing Testnet App ID: {app_id}")

    # 2. Create Ticket ASA (NFT)
    from algosdk import transaction
    params = call_with_retry(algod_client.suggested_params)
    txn = transaction.AssetCreateTxn(
        sender=address,
        sp=params,
        total=1,
        decimals=0,
        default_frozen=False,
        unit_name="TICKET",
        asset_name="Hackathon Entry Ticket",
        url="https://hackathon-pw.vercel.app/metadata/ticket.json",
        manager=address,
    )
    signed_txn = txn.sign(private_key)
    txid = call_with_retry(algod_client.send_transaction, signed_txn)
    print(f"Waiting for ASA creation... (Txn: {txid})")
    transaction.wait_for_confirmation(algod_client, txid, 4)
    
    ptx = call_with_retry(algod_client.pending_transaction_info, txid)
    asset_id = ptx["asset-index"]
    print(f"Ticket ASA created on Testnet! Asset ID: {asset_id}")

    # 3. Link App & Asset
    print(f"Linking ASA {asset_id} to App {app_id}...")
    call_with_retry(app_client.call, "set_ticket_asa", asset_id=asset_id)
    print("Done! Setup complete on Testnet.")

    # 4. Update .env with all Testnet details
    env_path = ".env"
    set_key(env_path, "ALGOD_SERVER", ALGOD_SERVER)
    set_key(env_path, "ALGOD_PORT", ALGOD_PORT)
    set_key(env_path, "ALGOD_TOKEN", ALGOD_TOKEN)
    set_key(env_path, "APP_ID", str(app_id))
    set_key(env_path, "ASSET_ID", str(asset_id))
    set_key(env_path, "DEPLOYER_ADDRESS", address)
    
    return {"app_id": app_id, "asset_id": asset_id}

if __name__ == "__main__":
    import sys
    existing_id = int(sys.argv[1]) if len(sys.argv) > 1 else None
    deploy_testnet(existing_id)
