import json
from algosdk import transaction
from beaker.localnet import get_algod_client, get_accounts
from beaker.client import ApplicationClient
from contracts.app import app

def deploy_full():
    algod = get_algod_client()
    acct = get_accounts()[0]
    print(f"Deployer: {acct.address}")

    client = ApplicationClient(
        client=algod,
        app=app,
        sender=acct.address,
        signer=acct.signer,
    )
    app_id, app_addr, txid = client.create()
    print(f"Contract deployed — App ID: {app_id}, Address: {app_addr}")

    params = algod.suggested_params()
    txn = transaction.AssetCreateTxn(
        sender=acct.address,
        sp=params,
        total=100,
        decimals=0,
        default_frozen=False,
        unit_name="TICKET",
        asset_name="Hackathon Entry Ticket",
        url="https://raw.githubusercontent.com/ADHARV-S-RAVI/Hackathon-PW/main/metadata/ticket.json",
        manager=acct.address,
        reserve=None,
        freeze=None,
        clawback=None,
    )
    signed_txn = txn.sign(acct.private_key)
    txid = algod.send_transaction(signed_txn)
    transaction.wait_for_confirmation(algod, txid, 4)
    ptx = algod.pending_transaction_info(txid)
    asset_id = ptx["asset-index"]
    print(f"Ticket ASA created — Asset ID: {asset_id}")

    client.call("set_ticket_asa", asset_id=asset_id)
    print(f"set_ticket_asa({asset_id}) called on contract")

    result = {
        "app_id": app_id,
        "app_address": app_addr,
        "asset_id": asset_id,
        "deployer": acct.address,
    }

    env_path = __file__.replace("contracts/scripts/deploy_full.py", ".env").replace("contracts\\scripts\\deploy_full.py", ".env")
    with open(env_path, "w") as f:
        f.write(f"ALGOD_SERVER=http://localhost\n")
        f.write(f"ALGOD_PORT=4001\n")
        f.write(f"ALGOD_TOKEN={'a'*64}\n")
        f.write(f"APP_ID={app_id}\n")
        f.write(f"ASSET_ID={asset_id}\n")
        f.write(f"DEPLOYER_ADDRESS={acct.address}\n")
    print(f"Wrote .env with deployment info")

    print("\n=== DEPLOYMENT COMPLETE ===")
    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    deploy_full()
