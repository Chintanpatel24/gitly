import "dotenv/config";
import infoEndpoint from "./api/index.js";
import prCard from "./api/pull-requests.js";
import contributionsCard from "./api/contributions.js";
import express from "express";

const app = express();
const router = express.Router();

router.get("/", infoEndpoint);
router.get("/pull-requests", prCard);
router.get("/contributions", contributionsCard);

app.use("/api", router);

const port = process.env.PORT || process.env.port || 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
