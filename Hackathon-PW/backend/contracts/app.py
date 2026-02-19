from beaker import Application
from beaker.state import GlobalStateValue
from pyteal import abi, AssetHolding, TealType, Int, Seq

app = Application("TicketApp")

# ---- Global State ----
ticket_asa = GlobalStateValue(
    key="ticket_asa",
    stack_type=TealType.uint64,
    default=Int(0),
)

# ---- Set ASA ID ----
@app.external
def set_ticket_asa(asset_id: abi.Uint64):
    return ticket_asa.set(asset_id.get())

# ---- Check Ticket Ownership (FIXED) ----
@app.external(read_only=True)
def check_ticket(owner: abi.Address, *, output: abi.Bool):
    bal = AssetHolding.balance(
        owner.get(),
        ticket_asa.get()
    )

    return Seq(
        bal,
        output.set(bal.hasValue())
    )

