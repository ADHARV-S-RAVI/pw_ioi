from algosdk import transaction
from beaker.localnet import get_algod_client, get_accounts

def create_ticket_asa():
    algod = get_algod_client()
    creator = get_accounts()[0]

    params = algod.suggested_params()

    txn = transaction.AssetCreateTxn(
        sender=creator.address,
        sp=params,
        total=1,                    # NFT = 1 supply
        decimals=0,                 # NFTs always 0
        default_frozen=False,
        unit_name="TICKET",
        asset_name="Hackathon Entry Ticket",
	url="https://raw.githubusercontent.com/ADHARV-S-RAVI/Hackathon-PW/main/metadata/ticket.json",
        metadata_hash=None,
        manager=creator.address,
        reserve=None,
        freeze=None,
        clawback=None,
    )

    signed_txn = txn.sign(creator.private_key)
    txid = algod.send_transaction(signed_txn)
    transaction.wait_for_confirmation(algod, txid, 4)

    ptx = algod.pending_transaction_info(txid)
    asset_id = ptx["asset-index"]

    print("Ticket ASA created with Asset ID:", asset_id)

if __name__ == "__main__":
    create_ticket_asa()

