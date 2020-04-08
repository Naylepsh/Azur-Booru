const express = require("express");
const router = express();

router
  .get("/not_found", (req, res) => res.render("errors/404-not-found"))
  .get("/internal_error", (req, res) =>
    res.render("errors/500-internal-error")
  );

module.exports = router;
