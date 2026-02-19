from beaker import Application
from beaker.state import GlobalStateValue
from pyteal import abi, Int, Txn


# ---------------------------------
# Application
# ---------------------------------

app = Application("TicketVerifier")


# ---------------------------------
# Global State
# ---------------------------------

app.state.ticket_asa = GlobalStateValue(
    stack_type=int, default=0, descr="Ticket ASA ID"
)


# ---------------------------------
# Set Ticket ASA (admin)
# ---------------------------------


@app.external
def set_ticket_asa(asset_id: abi.Uint64):
    return app.state.ticket_asa.set(asset_id.get())


# ---------------------------------
# Check Ticket Ownership
# ---------------------------------


@app.external(read_only=True)
def check_ticket(asset_id: abi.Uint64, *, output: abi.Bool):
    return output.set(Txn.sender().assetBalance(asset_id.get()) > Int(0))
