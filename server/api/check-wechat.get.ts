import { createHash } from 'crypto';

interface Query {
  signature: string;
  timestamp: string;
  nonce: string;
  echostr: string;
}

export default defineEventHandler(event => {
  const query = getQuery(event) as unknown as Query;
  const { MP_TOKEN } = useRuntimeConfig();
  const sortedArr = [MP_TOKEN, query.timestamp, query.nonce].sort();
  const sha1 = createHash('sha1');
  sha1.update(sortedArr.join(''));
  const signature = sha1.digest('hex');
  console.log('signature', signature, query.signature);
  if (signature !== query.signature) {
    console.log('Invalid signature', MP_TOKEN, query.timestamp, query.nonce);
    return 'Invalid signature';
  }
  return query.echostr;
});
