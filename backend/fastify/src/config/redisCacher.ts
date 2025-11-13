import Redis from 'ioredis'

const redis = new Redis({
    host:'10.110.18.15',
    port:30379,
});

export default redis
