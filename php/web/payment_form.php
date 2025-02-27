<?php include 'security.php' ?>
<html>
<head>
    <title>Secure Acceptance - Payment Form Example</title>
    <style>
        a {
            font-size: 1.0em;
            text-decoration: none;
        }

        input[type=submit] {
            margin-top: 10px;
        }

        span {
            font-weight: bold;
            width: 350px;
            display: inline-block;
        }

        .fieldName {
            width: 400px;
            font-weight: bold;
            vertical-align: top;
        }

        .fieldValue {
            width: 400px;
            font-weight: normal;
            vertical-align: top;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script type="text/javascript">
        // function setDefaultsForUnsignedDetailsSection() {
        //     $("input[name='card_type']").val("001");
        //     $("input[name='card_number']").val("4242424242424242");
        //     $("input[name='card_expiry_date']").val("11-2020");
        // }
    </script>
</head>
<body>
<?php
    $params = array();
    $params["access_key"] = "1196c8bbbc373f2a80e77460dd7e0b40";
    $params["profile_id"] = "6D7941B7-30D7-4A1C-AA6A-E36B7BB4FF2A";
    $params["transaction_uuid"] = uniqid();
    $params["signed_field_names"] = "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency";
    $params["unsigned_field_names"] = "";
    $params["signed_date_time"] = gmdate("Y-m-d\TH:i:s\Z");
    $params["locale"] = "en";
    
    // Default values for payment details
    $params["transaction_type"] = "authorization";
    $params["reference_number"] = time();
    $params["amount"] = "100.00";
    $params["currency"] = "USD";

    $params["bill_address1"] = "Deira";
    $params["bill_city"] = "Dubai";
    $params["bill_country"] = "United Arab Emirates";
    $params["customer_email"] = "ihshaan10@gmail.com";
    $params["customer_lastname"] = "Abdul";
    
    $signature = sign($params);
?>
<form id="payment_form" action="https://testsecureacceptance.cybersource.com/pay" method="post">
    <input type="hidden" name="access_key" value="<?php echo $params["access_key"]; ?>">
    <input type="hidden" name="profile_id" value="<?php echo $params["profile_id"]; ?>">
    <input type="hidden" name="transaction_uuid" value="<?php echo $params["transaction_uuid"]; ?>">
    <input type="hidden" name="signed_field_names" value="<?php echo $params["signed_field_names"]; ?>">
    <input type="hidden" name="unsigned_field_names" value="<?php echo $params["unsigned_field_names"]; ?>">
    <input type="text" name="signed_date_time" value="<?php echo $params["signed_date_time"]; ?>">
    <input type="hidden" name="locale" value="<?php echo $params["locale"]; ?>">
    <fieldset>
        <legend>Payment Details</legend>
        <div id="paymentDetailsSection" class="section">
            <span>transaction_type:</span><input type="text" name="transaction_type" value="<?php echo $params["transaction_type"]; ?>" size="25"><br/>
            <span>reference_number:</span><input type="text" name="reference_number" value="<?php echo $params["reference_number"]; ?>" size="25"><br/>
            <span>amount:</span><input type="text" name="amount" value="<?php echo $params["amount"]; ?>" size="25"><br/>
            <span>currency:</span><input type="text" name="currency" value="<?php echo $params["currency"]; ?>" size="25"><br/>
        </div>
    </fieldset>
    <fieldset>
        <legend>Shipping Details Details</legend>
        <div id="paymentDetailsSection" class="section">
            <span>Billing Address:</span><input type="text" id="bill_address1" name="bill_address1" value="<?php echo $params["bill_address1"]; ?>"/><br/>
            <span>City:</span><input type="text" id="bill_city" name="bill_city" value="<?php echo $params["bill_city"]; ?>"/><br/>
            <span>Country:</span><input type="text" id="bill_country" name="bill_country" value="<?php echo $params["bill_country"]; ?>"/><br/>
            <span>Customer Email:</span><input type="text" id="customer_email" name="customer_email" value="<?php echo $params["customer_email"]; ?>"/><br/>
            <span>Customer Email:</span><input type="text" id="customer_lastname" name="customer_lastname" value="<?php echo $params["customer_lastname"]; ?>"/>
        </div>
    </fieldset>
    <input type="hidden" id="signature" name="signature" value="<?php echo $signature; ?>"/>
    <input type="submit" id="submit" name="submit" value="Submit"/>
</form>
</body>
</html>
