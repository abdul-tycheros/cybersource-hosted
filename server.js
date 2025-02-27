require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const bodyParser = require("body-parser");

/**
 * Generate CyberSource signature using HMAC SHA256.
 * @param {string} data - The string to sign.
 * @param {string} secretKey - The CyberSource secret key.
 * @param {string} encoding - Encoding format (default is 'base64').
 * @returns {string} - The generated signature.
 */

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const parseSignatureString = (signatureString) => {
  const formData = {};
  const regex = /([^=,]+)=([^,]*)/g;
  let match;
  while ((match = regex.exec(signatureString)) !== null) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove "undefined" values
    if (value === "undefined") {
      value = "";
    }
    formData[key] = value;
  }
  // Define the signed fields explicitly
  formData.signed_field_names = "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,payment_method";
  formData.transaction_type = "authorization,create_payment_token";
  // Set unsigned_field_names to empty string if not present or undefined
  if (!formData.unsigned_field_names) {
    formData.unsigned_field_names = "";
  }
  return formData;
};

function generateCyberSourceSignature(params, secretKey) {
  if (!params || !secretKey) {
    throw new Error(
      "Parameters and secret key are required for signature generation"
    );
  }
  // Step 1: Sort fields in the order given in signed_field_names
  const signedFieldNames = params.signed_field_names.split(",");
  // Step 2: Create the signed data string (field=value pairs, comma-separated)
  const signedData = signedFieldNames
    .map((field) => `${field}=${params[field]}`)
    .join(",");

  // Step 3: Generate HMAC SHA256 signature
  // const hmac = crypto.createHmac('sha256', secretKey);
  // hmac.update(signedData);
  // return hmac.digest("base64");
  const signature = CryptoJS
    .createHmac("sha256", key)
    .update(signedData)
    .digest("base64")
  return signature
}

app.post("/generate-cybersource-pay-signature", (req, res) => {
  try {
    const { signatureString } = req.body;

    if (!signatureString) {
      return res.status(400).json({ error: "Signature string is required" });
    }

    if (!process.env.CYBERSOURCE_SECRET_KEY) {
      return res.status(500).json({ error: "Secret key is not configured" });
    }

    // Convert signatureString into an object
    const formData = parseSignatureString(signatureString);

    // Ensure signed_field_names exists and is properly formatted
    if (!formData.signed_field_names) {
      return res.status(400).json({ error: "signed_field_names is missing" });
    }

    // Extract the secret key from environment variables
    const secretKey = process.env.CYBERSOURCE_SECRET_KEY;

    console.log("signed_field_names: ", formData.signed_field_names);

    // Generate the signature using the provided formData
    const signature = generateCyberSourceSignature(formData, secretKey);

    res.json({ signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/cybersource-callback", (req, res) => {
  let response = req.body;
  console.log("Callback Response: ", response);
  res.json({ response });
});

app.post("/cybersource-cancel-callback", (req, res) => {
  let response = req.body;
  console.log("Cancel Response: ", response);
  res.json({ response });
});

// Generate CyberSource Signature
app.post("/generate-mbme-pay-signature", (req, res) => {
  try {
    const { signatureString } = req.body;
    const secretKey = process.env.MBME_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ error: "Secret key is missing" });
    }
    if (!signatureString) {
      return res.status(400).json({ error: "Signature string is required" });
    }

    const signature = generateGenericSignature(signatureString, secretKey);
    res.json({ signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateGenericSignature(signatureString, secretKey) {
  // Parse the signature string into an object
  const params = parseSignatureString(signatureString);
  
  // Build data to sign (similar to PHP buildDataToSign function)
  const signedFieldNames = params.signed_field_names.split(",");
  const dataToSign = signedFieldNames.map(field => `${field}=${params[field]}`);
  const commaSeparated = dataToSign.join(",");
  
  // Create HMAC SHA256 signature (similar to PHP signData function)
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(commaSeparated);
  return hmac.digest('base64');
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
