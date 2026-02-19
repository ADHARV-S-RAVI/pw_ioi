from beaker.localnet import get_algod_client, get_accounts
from beaker.client import ApplicationClient
from contracts.app import app

APP_ID = 1009

def main():
    algod = get_algod_client()
    accounts = get_accounts()

    owner = accounts[0]  # ticket holder

    client = ApplicationClient(
        client=algod,
        app=app,
        app_id=APP_ID,
        sender=owner.address,
        signer=owner.signer,
    )

    result = client.call("check_ticket", owner=owner.address)
    print("Has valid ticket:", result.return_value)

if __name__ == "__main__":
    main()

