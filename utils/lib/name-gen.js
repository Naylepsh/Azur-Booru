const crypto = require('crypto'),
    path = require('path');


module.exports = {
    generateRandomFilename(file){
        return new Promise( (resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                resolve(buf.toString('hex') + path.extname(file.originalname));
            });
        });
    }
}

