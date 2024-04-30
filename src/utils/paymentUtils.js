import {APP_CONSTANTS} from '../constants/Strings';
import Config from 'react-native-config';

export const getPanErrorMessage = ({code, message, isEBT = true}) => {
  switch (code) {
    case '871':
    case '872':
    case '873':
    case '874':
    case '876':
    case '881':
    case '882':
    case '883':
      return isEBT ? APP_CONSTANTS.INVALID_SNAP_CARD : APP_CONSTANTS.INVALID_DEBIT_CARD;
    case '875':
    case '884':
    case '889':
      return APP_CONSTANTS.SOME_THING_WENT_WRONG;
    default:
      return message;
  }
};

export const getPinErrorMessage = ({code, message}) => {
  switch (code) {
    case '893':
    case '894':
    case '898':
      return APP_CONSTANTS.INVALID_SNAP_PIN;
    case '875':
    case '884':
    case '889':
      return APP_CONSTANTS.SOME_THING_WENT_WRONG;
    default:
      return message;
  }
};

export const clearSnapFormScript = `
document.getElementById('eProtect-iframe').src = document.getElementById('eProtect-iframe').src;
true`;

export const submitSnapFormScript = `
document.getElementById('submitButton').click();
true`;

export const postMessageScript = `function postResponseToClient(data) {
    if (typeof window.ReactNativeWebView !== "undefined") {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
      window.postMessage(JSON.stringify(data));
    }
  }`;

export const renderHeaderHtml = `<head>
  <title>EBT Card</title>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1" name="viewport">
  <script crossorigin src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
  <script src="${Config.BASE_URL}assets/payframe-client.min.js"></script>
  <style>
      #submitButton {
          display: none;
      }
  </style>
</head>
<body>`;

export const renderIframeHtml = `<div class="checkout">
  <form id="fCheckout" method="post" name="fCheckout" onsubmit="return false;">
    <div id="payframe"></div>
    <input id="submitButton" type="submit">
  </form>
</div>`;

export const getSnapPinHtml = config => {
  const {paypageId, style, timeout = 30000, htmlTimeout = 10000, reportGroup} = config || {};
  return `<html>
${renderHeaderHtml}
${renderIframeHtml}
<script>
  $(document).ready(function() {
    var startTime;
    var payframeClientCallback = function(response) {
      response.elapsedTime = new Date().getTime() - startTime;
      postResponseToClient(response);
    };
    var configure = {
      "paypageId": "${paypageId}",
      "style": "${style}",
      "reportGroup": "${reportGroup}",
      "timeout": ${timeout},
      "div": "payframe",
      "callback": payframeClientCallback,
      "checkoutPinMode": true,
      "showCvv": false,
      "htmlTimeout": ${htmlTimeout},
      "tooltipText": "A CVV is the 3 digit code on the back of your Visa, MasterCard and Discover or a 4 digit code on the front of your American Express",
      "placeholderText": {
        "cvv": "CVV",
        "accountNumber": "Enter Card Number",
        "pin": "Enter Pin Number",
      },
      "inputsEmptyCallback": inputsEmptyCallback,
      "clearCvvMaskOnReturn": true,
      "enhancedUxFeatures": {
        "inlineFieldValidations": true,
        "numericInputsOnly": true,
      },
    };
    var payframeClient = new EprotectIframeClient(configure);
    document.getElementById("fCheckout").onsubmit = function() {
      startTime = new Date().getTime();
      var message = {
        "id": "ID_"+startTime,
        "orderId": "ORDER_"+startTime,
      };
      payframeClient.getCheckoutPin(message);
      return false;
    };

    function inputsEmptyCallback(res) {
      var isEmpty = res.allInputsEmpty;
      if (isEmpty) {
        postResponseToClient(res);
        return true;
      } else {
        return false;
      }
    }
    function checkPayframeLoaded() {
      if (iframeIsReady === true) {
         payframeClient.autoAdjustHeight();
         postResponseToClient({iframeIsReady: true})
      } else {
        setTimeout(checkPayframeLoaded, 200);
      }
    }

    checkPayframeLoaded();
    ${postMessageScript}
  });
</script>
</body>
</HTML>
`;
};

export const getSnapCardHtml = config => {
  const {paypageId, style, timeout = 30000, htmlTimeout = 10000, reportGroup} = config || {};
  return `<html>
${renderHeaderHtml}
${renderIframeHtml}
<script>
  $(document).ready(function() {
    var startTime;
    var payframeClientCallback = function(response) {
      response.elapsedTime = new Date().getTime() - startTime;
      const {panResponse, pinResponse, response: cardCode, message: cardMessage} = response ?? {};
      const {response: pinCode, message: pinMessage} = pinResponse ?? {};
      const {response: panCode, message: panMessage} = panResponse ?? {};
      if((pinCode === '870' && panCode !== '870') || (pinCode !== '870' && panCode === '870')){
        document.getElementById('eProtect-iframe').src = document.getElementById('eProtect-iframe').src
      }
      postResponseToClient(response);
    };
    function inputsEmptyCallback(res) {
      var isEmpty = res.allInputsEmpty;
      if (isEmpty) {
        postResponseToClient(res);
        return true;
      } else {
        return false;
      }
    }
    var configure = {
      "paypageId": "${paypageId}",
      "style": "${style}",
      "reportGroup": "${reportGroup}",
      "timeout": ${timeout},
      "div": "payframe",
      "callback": payframeClientCallback,
      "checkoutCombinedMode": true,
      "htmlTimeout": ${htmlTimeout},
      "placeholderText": {
        "accountNumber": "Card Number",
        "pin": "Pin Number",
      },
      "inputsEmptyCallback": inputsEmptyCallback,
      "enhancedUxFeatures": {
        "inlineFieldValidations": true,
        "numericInputsOnly": true,
      },
      "minPanLength": "15",
    };
    var payframeClient = new EprotectIframeClient(configure);
    document.getElementById("fCheckout").onsubmit = function() {
      startTime = new Date().getTime();
      var message = {
        "id": "ID_"+startTime,
        "orderId": "ORDER_"+startTime,
      };
      payframeClient.getCombinedTokens(message);
      return false;
    };

    function checkPayframeLoaded() {
      if (iframeIsReady === true) {
        postResponseToClient({iframeIsReady: true});
        payframeClient.autoAdjustHeight();
        $("#payframe").css("visibility", "visible");
      } else {
        setTimeout(checkPayframeLoaded, 200);
      }
    }
    checkPayframeLoaded();
  });
  ${postMessageScript}
</script>
</body>
</HTML>
`;
};

export const getDebitCardHtml = config => {
  const {
    paypageId,
    style,
    timeout = 30000,
    htmlTimeout = 10000,
    reportGroup,
    jqueryCDN,
    eProtectCDN,
    numYears,
    expMonth,
    expYear,
  } = config || {};
  return `<HTML>
<head>
  <title>Credit/Debit Card</title>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1" name="viewport">
  <script src="${jqueryCDN}"}></script>
  <script src="${eProtectCDN}"></script>
</head>
<BODY>
<div class='checkout'>
  <form id='fCheckout' method='post' name='fCheckout' onsubmit='return false;'>
    <div id='payframe'></div>
    <input id='submitButton' type='submit' hidden></button>
  </form>
</div>
<script>
  $(document).ready(function() {
    var startTime;
    var payframeClientCallback = function(response) {
      response.elapsedTime = new Date().getTime() - startTime;
      postResponseToClient(response);
    };
    var configure = {
      'paypageId': '${paypageId}',
      'style': '${style}',
      'reportGroup': '${reportGroup}',
      'timeout': '${timeout}',
      'div': 'payframe',
      'callback': payframeClientCallback,
      'showCvv': true,
      'htmlTimeout': '${htmlTimeout}',
      'numYears': '${numYears}',
      'placeholderText': {
        'accountNumber': 'Card Number',
        'cvv': 'CVV',
        'expMonth': '${expMonth}',
        'expYear': '${expYear}',
      },
      'enhancedUxFeatures': {
        'inlineFieldValidations': true,
        'expDateValidation': false,
        'enhancedUxVersion': 2,
      },
    };
    
    var payframeClient = new LitlePayframeClient(configure);
    
    const iframe = document.getElementById('vantiv-payframe');
     iframe.onload = function() {
       setTimeout(()=>{
          postResponseToClient({webViewHeight: document.documentElement.scrollHeight});
          payframeClient.autoAdjustHeight();
          postResponseToClient({iframeIsReady: true});
          }, 100);
     };
    document.getElementById('fCheckout').onsubmit = function() {
      startTime = new Date().getTime();
      payframeClient.getPaypageRegistrationId({
        'id': 'ID_' + startTime,
        'orderId': 'ORDER_' + startTime,
      });
      return false;
    };
  });
  ${postMessageScript}
</script>
</BODY>
</HTML>`;
};
