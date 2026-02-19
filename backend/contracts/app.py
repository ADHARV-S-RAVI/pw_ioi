from beaker import Application
from beaker.state import GlobalStateValue
from pyteal import abi, Int, Seq, Assert, TealType

app = Application("TicketApp")

# Global state: Ticket ASA ID
ticket_asa = GlobalStateValue(
    stack_type=TealType.uint64,
    default=Int(0),
    key="ticket_asa",
)

@app.external
def set_ticket_asa(asset_id: abi.Uint64):
    return Seq(
        Assert(asset_id.get() > Int(0)),
        ticket_asa.set(asset_id.get()),
    )

@app.external(read_only=True)
def get_ticket_asa(*, output: abi.Uint64):
    return output.set(ticket_asa.get())

