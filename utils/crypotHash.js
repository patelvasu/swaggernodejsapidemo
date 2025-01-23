const { createHash } = require('crypto');

module.exports.sha256HashString = (input)=>{
    return createHash('sha256').update(input).digest('hex');    
}
