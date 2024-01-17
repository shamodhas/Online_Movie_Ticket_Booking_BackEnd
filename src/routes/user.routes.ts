import express from "express";

const router = express.Router();

router.get("/all", (req: express.Request, res: express.Response) => {
  res.send("dfgvf");
});

export default router;
