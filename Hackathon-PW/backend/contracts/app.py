from beaker import Application, GlobalStateValue
from pyteal import *
from pyteal import abi

app = Application("ticket_app")

# Global state (1 uint)
ticket_asa = GlobalStateValue(
    stack_type=TealType.uint64,
    default=Int(0),
)

@app.external
def set_ticket_asa(asset_id: abi.Uint64):
    return ticket_asa.set(asset_id.get())

@app.external(read_only=True)
def get_ticket_asa(*, output: abi.Uint64):
    return output.set(ticket_asa.get())

@app.external(read_only=True)
def check_ticket(owner: abi.Address, *, output: abi.Bool):
    bal = AssetHolding.balance(owner.get(), ticket_asa.get())
    return Seq(
        bal,
        output.set(bal.hasValue() & (bal.value() > Int(0)))
    )

