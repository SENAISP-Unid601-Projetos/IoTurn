import { createHash } from "crypto";
let data = "gandalfdecalcinharosa"

console.log(createHash('sha256').update(data).digest('hex'))