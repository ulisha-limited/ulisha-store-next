# Ulisha Store

Your one-stop shop for all things trendy and affordable.

## Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Installation

```bash
git clone https://github.com/ulisha/ulisha-store-next.git
cd ulisha-store-next
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following:

```env
# Paystack config
PAYSTACK_SECRET_KEY=
PAYSTACK_CALLBACK_URL_DEVELOPMENT=http://localhost:3000/orders
PAYSTACK_CALLBACK_URL_PRODUCTION=https://ulishastore.com/orders

# Mixpay config
MIXPAY_APP_ID=

# Add other environment variables as needed
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

This project is licensed under the [Apache License 2.0](LICENSE).


&copy; 2025 Ulisha Limited.
