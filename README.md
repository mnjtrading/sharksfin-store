## Messenger Checkout

This storefront now includes a frontend-only Messenger checkout flow.

### How it works
- Clicking **Checkout** in the cart opens an order summary modal.
- Customers enter Name, Phone Number, Delivery Address, and optional Notes.
- Confirming opens Facebook Messenger with a pre-filled order message.

### Change the Messenger destination page
Update the username in `js/messengerCheckout.js`:

```js
const MESSENGER_PAGE_USERNAME = "iam.nathan.18";
```

The deep link is generated from that single variable (`https://m.me/<username>`), so no other files need updating.
