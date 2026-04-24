// .env file theke URL ta tene nicche
const API_URL = import.meta.env.VITE_API_URL;

// 1. Backend theke Product Catalog anar function
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/catalog`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// 2. Order pathano r OTP anar function
export const placeOrder = async (orderDetails: any) => {
  try {
    const response = await fetch(`${API_URL}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    });
    return await response.json();
  } catch (error) {
    console.error("Order placed failed:", error);
    return { error: 'Failed to place order' };
  }
};

// 3. OTP verify kora r Razorpay link anar function
export const verifyOTP = async (orderRef: string, otp: string) => {
  try {
    const response = await fetch(`${API_URL}/api/order/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_ref: orderRef,
        otp: otp
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("OTP verification failed:", error);
    return { error: 'Failed to verify OTP' };
  }
};
