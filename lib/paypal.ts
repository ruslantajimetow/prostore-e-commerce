const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generatePaypalToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errmsg = await response.text();
      throw new Error(errmsg);
    }
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generatePaypalToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errmsg = await response.text();
      throw new Error(errmsg);
    }
  },
};

//Generate paypal access token

async function generatePaypalToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_APP_SECRET}`
  ).toString('base64');

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log(response);

  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.access_token;
  } else {
    const errormsg = await response.text();
    throw new Error(errormsg);
  }
}

export { generatePaypalToken };
