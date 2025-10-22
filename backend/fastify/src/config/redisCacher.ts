import Redis from "ioredis";

const redis = new Redis({
    host:'172.27.64.1',
    port:30379,
});

export default redis;