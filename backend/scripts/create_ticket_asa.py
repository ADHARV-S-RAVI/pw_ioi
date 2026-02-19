from algosdk import transaction
from beaker.localnet import get_algod_client, get_accounts

def main():
    algod = get_algod_client()
    creator = get_accounts()[0]

    params = algod.suggested_params()

    txn = transaction.AssetCreateTxn(
        sender=creator.address,
        sp=params,
        total=1000,              # 1000 tickets
        decimals=0,
        default_frozen=False,
        unit_name="TICKET",
        asset_name="Hackathon Ticket",
        manager=creator.address,
        reserve=creator.address,
        freeze=creator.address,
        clawback=creator.address,
    )

    signed = txn.sign(creator.private_key)
    txid = algod.send_transaction(signed)
    result = transaction.wait_for_confirmation(algod, txid, 4)

    print("🎟 Ticket ASA ID:", result["asset-index"])

if __name__ == "__main__":
    main()

