const express = require("express");
const router = express();
const { asyncWrapper } = require("../middleware/route-wrappers");

router.get(
  "/",
  asyncWrapper((req, res) => {
    res.render("landing", { user: req.user });
  })
);

module.exports = router;
