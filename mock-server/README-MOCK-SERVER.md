# Mock Server Guide - Transaction Journeys

## 🚀 Quick Start

The mock server is currently running on **port 9999**.

### Access Points

1. **Dev Interface (Mock Management UI)**
   - URL: http://localhost:9999/dev-interface
   - Use this to view, manage, and switch between mock scenarios

2. **Test Page (Transaction UI)**
   - File: `mock-server/test-transactions.html`
   - Open this file in your browser to test transaction APIs
   - Or serve it with: `python3 -m http.server 8080` (then visit http://localhost:8080/test-transactions.html)

3. **API Endpoint**
   - Base URL: http://localhost:9999/api
   - All API calls should be prefixed with this base URL

## 📋 Available Mocks

The following mocks are configured and available:

### Transactions
- **Endpoint**: `POST /transaction-manager/client-api/v2/transactions`
- **Mock File**: `mock-server/mocks/golden-sample-app/transactions/transactions.json`
- **Scenarios**: 
  - `ok` (default) - Returns list of transactions
  - `internal_server_error` - Returns 500 error
  - `not_found` - Returns 404 error

### Arrangements
- **Endpoint**: `GET /arrangement-manager/client-api/v2/arrangements`
- **Mock File**: `mock-server/mocks/golden-sample-app/arrangements/arrangement_id.json`

### Balances
- **Endpoint**: `GET /arrangement-manager/client-api/v2/balances/aggregations`
- **Mock File**: `mock-server/mocks/golden-sample-app/balance/balance_aggregations.json`

### Payment Orders
- **Endpoint**: `POST /payment-order/client-api/v1/payment-orders`
- **Mock File**: `mock-server/mocks/golden-sample-app/payment-orders/payment-orders.json`

### Access Groups
- User context and permissions mocks available in `accessgroups/` directory

## 🧪 Testing the APIs

### Using the Test Page

1. Open `mock-server/test-transactions.html` in your browser
2. Click the buttons to test different endpoints:
   - **Fetch Transactions** - Gets transaction list
   - **Fetch Arrangements** - Gets account arrangements
   - **Fetch Balances** - Gets balance aggregations

### Using curl

```bash
# Fetch transactions
curl -X POST http://localhost:9999/transaction-manager/client-api/v2/transactions \
  -H "Content-Type: application/json" \
  -d '{"arrangementIds": [], "size": 10, "from": 0}'

# Fetch arrangements
curl http://localhost:9999/arrangement-manager/client-api/v2/arrangements

# Fetch balances
curl http://localhost:9999/arrangement-manager/client-api/v2/balances/aggregations
```

### Using the Dev Interface

1. Visit http://localhost:9999/dev-interface
2. Select a mock (e.g., "transactions")
3. Switch between scenarios (ok, internal_server_error, not_found)
4. View and modify mock responses

## 🔧 Managing the Mock Server

### Start the server
```bash
npm run mock-server
```

### Stop the server
```bash
npm run kill-mocks
# or
lsof -ti:9999 | xargs kill -9
```

### Check if server is running
```bash
lsof -ti:9999 && echo "Server is running" || echo "Server is not running"
```

## 📝 Mock Configuration

Mocks are defined in JSON files in `mock-server/mocks/golden-sample-app/`.

Each mock file contains:
- `name` - Mock identifier
- `request` - URL pattern and HTTP method to match
- `responses` - Different response scenarios (ok, error, etc.)

## 🎯 Transaction Journey Features

The transaction mocks include:
- Multiple transaction types (Deposit, Withdrawal)
- Various categories (Travel, Alcohol & Bars, etc.)
- Different states (COMPLETED, etc.)
- Credit/Debit indicators
- Counter party information
- Amount and currency details
- Booking and value dates

## 💡 Tips

1. **Change Scenarios**: Use the dev interface to switch between success and error scenarios
2. **View Raw Data**: Check the JSON files in `mock-server/mocks/` to see the exact data structure
3. **Test Error Handling**: Switch to error scenarios to test how your app handles failures
4. **Modify Mocks**: Edit the JSON files and the server will automatically reload (watch mode enabled)

## 🔗 Related Files

- Mock server script: `mock-server/mock-server.js`
- Mock data: `mock-server/mocks/golden-sample-app/`
- Test page: `mock-server/test-transactions.html`
- Proxy config: `apps/golden-sample-app/proxy.mocks.conf.js`

