from beaker.localnet import get_algod_client, get_accounts
from algosdk.transaction import AssetOptInTxn

ASA_ID = 1004  # your ticket ASA

def main():
    algod = get_algod_client()
    acct = get_accounts()[0]

    params = algod.suggested_params()
    txn = AssetOptInTxn(
        sender=acct.address,
        sp=params,
        index=ASA_ID,
    )

    signed = txn.sign(acct.private_key)
    algod.send_transaction(signed)

    print("Opted-in to Ticket ASA:", ASA_ID)

if __name__ == "__main__":
    main()

