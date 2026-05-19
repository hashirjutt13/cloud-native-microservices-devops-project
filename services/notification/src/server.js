import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3004);
const app = createApp();

app.listen(port, () => {
  console.log(`notification-service listening on ${port}`);
});
