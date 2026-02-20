from beaker import Application
from beaker.state import GlobalStateValue
from pyteal import abi, Int, Txn, TealType, AssetHolding, Seq, If


class AppState:
    ticket_asa = GlobalStateValue(
        stack_type=TealType.uint64, default=Int(0), descr="Ticket ASA ID"
    )


app = Application("TicketVerifier", state=AppState())


@app.external
def set_ticket_asa(asset_id: abi.Uint64):
    return app.state.ticket_asa.set(asset_id.get())


@app.external(read_only=True)
def check_ticket(asset_id: abi.Uint64, *, output: abi.Bool):
    balance = AssetHolding.balance(Txn.sender(), asset_id.get())
    return Seq(
        balance,
        output.set(If(balance.hasValue(), balance.value() > Int(0), Int(0))),
    )
