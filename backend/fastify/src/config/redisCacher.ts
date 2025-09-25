import Redis from "ioredis";

const redis = new Redis({
    host:'10.110.12.76',
    port:6379,
});

export default redis;