const decode = require ("jwt-decode")

function decoding(res){
    if (!res.headers.authorization || res.headers.authorization === null) {
      return ;
    }
    return decode.jwtDecode(res.headers.authorization);
}

module.exports = {decoding}