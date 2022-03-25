var axios = require('axios');
var data = JSON.stringify({"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6acF908B75713d38E7Fabc9DB309721CEF12A603","latest"],"id":0});

var config = {
  method: 'post',
  url: 'https://polygon-mainnet.g.alchemyapi.io/v2/zc4CzqwB0LjNvHXdAYwGFQrDqfE1uNY-',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
