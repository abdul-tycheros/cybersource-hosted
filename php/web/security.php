<?php

define ('HMAC_SHA256', 'sha256');
define ('SECRET_KEY', '95b315beef4f4c8fac153acdaca4b95f49da4e0f77624bdb8c2a2c8e25111ac06917e4d4aba24484bd0d6a595ca35cbf050982fc2e9b4b09a5df4f37789b6f6f3d17a91a0dd64f528945dddbf53200fb16c00e5c758744918960f772aa05b7e05c64cf65e83c42f8a3df331079988eafcbf5b0df16d74b5d8fb8bd610027bf81');

function sign ($params) {
  return signData(buildDataToSign($params), SECRET_KEY);
}

function signData($data, $secretKey) {
    $signature = base64_encode(hash_hmac('sha256', $data, $secretKey, true));
    echo "<script>console.log('PHP Log Signature: " . $signature . "');</script>";
    return $signature;
}

function buildDataToSign($params) {
        $signedFieldNames = explode(",",$params["signed_field_names"]);
        foreach ($signedFieldNames as $field) {
           $dataToSign[] = $field . "=" . $params[$field];
        }
        
        $commaSeparated = commaSeparate($dataToSign);

        echo "<script>console.log('signatureString: " . $commaSeparated . "');</script>";

        return $commaSeparated;
}

function commaSeparate ($dataToSign) {
    return implode(",",$dataToSign);
}

?>
