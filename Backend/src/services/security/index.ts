import crypto from 'crypto';

function hash(text: string): string{
    return crypto.createHash("sha256").update(text).digest("hex")
}

export default{
    hash
}