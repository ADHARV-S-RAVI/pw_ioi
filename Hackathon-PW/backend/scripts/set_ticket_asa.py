from beaker.localnet import get_algod_client, get_accounts
from beaker.client import ApplicationClient
from contracts.app import app

APP_ID = 1009
TICKET_ASA_ID = 1004

def main():
    algod = get_algod_client()
    acct = get_accounts()[0]

    client = ApplicationClient(
        client=algod,
        app=app,
        app_id=APP_ID,
        sender=acct.address,
        signer=acct.signer,
    )

    client.call("set_ticket_asa", asset_id=TICKET_ASA_ID)
    print("Ticket ASA ID set in contract")

if __name__ == "__main__":
    main()

