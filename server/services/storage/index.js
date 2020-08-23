const LocalStorageService = require("./local-storage.service");
const GoogleCloudStorageService = require("./google-cloud-storage.service");

const services = {
  local: LocalStorageService,
  gcs: GoogleCloudStorageService,
};

module.exports = services[process.env.STORAGE_SERVICE || "local"];
