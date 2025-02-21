import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";

const secretKey =
  "95b315beef4f4c8fac153acdaca4b95f49da4e0f77624bdb8c2a2c8e25111ac06917e4d4aba24484bd0d6a595ca35cbf050982fc2e9b4b09a5df4f37789b6f6f3d17a91a0dd64f528945dddbf53200fb16c00e5c758744918960f772aa05b7e05c64cf65e83c42f8a3df331079988eafcbf5b0df16d74b5d8fb8bd610027bf81";

const generateReferenceNumber = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateSignedDateTime = () =>
  new Date().toISOString().split(".")[0] + "Z";

interface PaymentFormData {
  email: string;
  amount: string;
  currency: string;
}

export const retrieveCyberSourceForm = async (data: PaymentFormData) => {
  if (!data || !data.amount || !data.currency) {
    throw new Error("Missing required payment data (amount, currency).");
  }

  const transactionUuid = Crypto.randomUUID();
  const signedDateTime = generateSignedDateTime();
  const referenceNumber = generateReferenceNumber();

  const signedFieldNames = [
    "access_key",
    "profile_id",
    "transaction_uuid",
    "signed_field_names",
    "unsigned_field_names",
    "signed_date_time",
    "locale",
    "transaction_type",
    "reference_number",
    "amount",
    "currency",
    "payment_method",
  ].join(",");

  const signedFields = {
    access_key: "1196c8bbbc373f2a80e77460dd7e0b40",
    profile_id: "6D7941B7-30D7-4A1C-AA6A-E36B7BB4FF2A",
    transaction_uuid: transactionUuid,
    signed_field_names: signedFieldNames,
    unsigned_field_names: "",
    signed_date_time: signedDateTime,
    locale: "en",
    transaction_type: "authorization,create_payment_token",
    reference_number: referenceNumber,
    amount: data.amount,
    currency: data.currency.toUpperCase(),
    payment_method: "card",
  };

  const signatureString = Object.keys(signedFields)
    .sort()
    .map((key) => `${key}=${signedFields[key as keyof typeof signedFields]}`)
    .join(",");

  // Fetch the signature from your server
  // const response = await fetch("http://localhost:8080/generate-signature", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ signatureString }),
  // });
  // const { signature } = await response.json();

  // Generate signature using HMAC SHA256 and encode as Base64
  const signature = CryptoJS.HmacSHA256(signatureString, secretKey).toString(
    CryptoJS.enc.Base64
  );

  console.log("signature ====> ", signature);

  // Create the form HTML with the signature
  const formHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Secure Payment Form</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <form id="payment_form" action="https://testsecureacceptance.cybersource.com/pay" method="post">
        <input type="hidden" name="access_key" value="1196c8bbbc373f2a80e77460dd7e0b40">
        <input type="hidden" name="profile_id" value="6D7941B7-30D7-4A1C-AA6A-E36B7BB4FF2A">
        <input type="text" name="transaction_uuid" value="${transactionUuid}">
        <input type="hidden" id="unsigned_field_names" name="unsigned_field_names" value>
        <input type="text" name="signed_date_time" value="${signedDateTime}">
        <input type="hidden" name="locale" value="en">
        <input type="hidden" name="transaction_type" size="25" value="authorization, create_payment_token">
        <input type="text" name="reference_number" size="25" value="${referenceNumber}">
        <input type="text" name="amount" size="25" value="${data.amount}">
        <input type="text" name="currency" size="25" value="${data.currency.toUpperCase()}">
        <input type="text" name="signed_field_names"  value="${signedFieldNames}">
        <input type="hidden" name="payment_method" size="25" value="card">
        <input type="text" name="signature" value="${signature}">
        <button type="submit" id="submit" name="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Checkout with HOP</button>
      </form>
    </body>
    </html>
  `;

  return formHtml;
};
