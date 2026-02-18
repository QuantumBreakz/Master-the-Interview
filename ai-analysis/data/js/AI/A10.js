// AI-generated encryption example
// Demonstrates AES encryption and SHA256 hashing

const crypto = require('crypto');

// AES encryption
function encrypt(text, key) {
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// AES decryption
function decrypt(enc, key) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), Buffer.alloc(16, 0));
    let dec = decipher.update(enc, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// SHA256 hashing
function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// Example usage
const key = crypto.randomBytes(16);
const message = "This is secret";

const encrypted = encrypt(message, key);
console.log("Encrypted:", encrypted);

const decrypted = decrypt(encrypted, key);
console.log("Decrypted:", decrypted);

console.log("SHA256 hash:", hash(message));
