import os

with open("ccxt_mcp.py", "r") as f:
    content = f.read()

# Fix 1: Add Authorization header to create_order request
old_create = """        # Call backend to register pending order
        res = requests.post(f"{DASHBOARD_API_URL}/api/order/pending", json=payload, timeout=5)"""
new_create = """        # Call backend to register pending order
        headers = {"Authorization": f"Bearer {os.getenv('DASHBOARD_PASSWORD', '')}"}
        res = requests.post(f"{DASHBOARD_API_URL}/api/order/pending", json=payload, headers=headers, timeout=5)"""
content = content.replace(old_create, new_create)

# Fix 2: Add Authorization header to log_reasoning request
old_log = """        res = requests.post(f"{DASHBOARD_API_URL}/api/order/reasoning", json=payload, timeout=5)"""
new_log = """        headers = {"Authorization": f"Bearer {os.getenv('DASHBOARD_PASSWORD', '')}"}
        res = requests.post(f"{DASHBOARD_API_URL}/api/order/reasoning", json=payload, headers=headers, timeout=5)"""
content = content.replace(old_log, new_log)

# Fix 3: Add approval_token check to execute_approved_order
old_exec = """@mcp.tool()
def execute_approved_order(exchange: str, symbol: str, side: str, type: str, amount: float, price: Optional[float] = None, params: Optional[dict] = None) -> dict:
    \"\"\"Internal tool called by the backend to actually execute the order after human approval.\"\"\"
    ex = _make_exchange(exchange)
    params = params or {}"""
new_exec = """@mcp.tool()
def execute_approved_order(exchange: str, symbol: str, side: str, type: str, amount: float, price: Optional[float] = None, params: Optional[dict] = None) -> dict:
    \"\"\"Internal tool called by the backend to actually execute the order after human approval.\"\"\"
    params = params or {}
    db_pass = os.getenv("DASHBOARD_PASSWORD")
    if db_pass and params.pop("approval_token", None) != db_pass:
        return {"error": "Unauthorized: Dashboard approval required. Use create_order instead."}
    ex = _make_exchange(exchange)"""
content = content.replace(old_exec, new_exec)

with open("ccxt_mcp.py", "w") as f:
    f.write(content)
