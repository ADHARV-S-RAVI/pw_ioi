from beaker.client import ApplicationClient
from beaker.localnet import get_algod_client, get_accounts
from contracts.app import app

# 🔴 MUST MATCH WHAT YOU ACTUALLY DEPLOYED
APP_ID = 1004  # <-- your deployed app id
TICKET_ASA_ID = 1004  # <-- the ASA you set in set_ticket_asa.py


def main():
    algod = get_algod_client()
    accounts = get_accounts()
    caller = accounts[0]

    client = ApplicationClient(
        client=algod,
        app=app,
        app_id=APP_ID,  # ✅ THIS WAS MISSING
        sender=caller.address,
        signer=caller.signer,
    )

    result = client.call(
        "check_ticket", asset_id=TICKET_ASA_ID  # ✅ ABI argument
    )

    print("Has valid ticket:", result.return_value)


if __name__ == "__main__":
    main()
