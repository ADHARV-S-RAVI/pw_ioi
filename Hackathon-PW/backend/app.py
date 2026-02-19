cat > contracts/app.py << 'EOF'
from beaker import Application
from pyteal import *
from pyteal import abi

app = Application("ticket_app")

@app.external
def hello(name: abi.String, *, output: abi.String):
    return output.set(Concat(Bytes("Hello "), name.get()))
EOF

