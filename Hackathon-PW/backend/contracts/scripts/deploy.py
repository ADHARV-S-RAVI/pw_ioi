from beaker.localnet import get_algod_client, get_accounts
from beaker.client import ApplicationClient
from contracts.app import app

def deploy():
    algod = get_algod_client()
    acct = get_accounts()[0]

    client = ApplicationClient(
        client=algod,
        app=app,
        sender=acct.address,
        signer=acct.signer,
    )

    app_id = client.create()
    print("App deployed with App ID:", app_id)

if __name__ == "__main__":
    deploy()

