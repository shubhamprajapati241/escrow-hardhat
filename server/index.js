const express = require("express");
const app = express();
const cors = require("cors");

const port = 3042;

app.use(cors());
app.use(express.json());

const contractDetails = [];

app.get("/getAddresses", (req, res) => {
  res.status(200).send({
    succuess: true,
    message: "Details found",
    contractDetails: contractDetails,
  });
});

app.post("/approve", (req, res) => {
  let { address } = req.body;
  if (!address) {
    res.status(400).send({ succuess: false, message: "Address not found" });
  } else {
    const add = contractDetails.find((c) => c.address == address);
    add.isApprove = true;
    res.status(200).send({
      succuess: true,
      message: "Address is approved",
      contractDetails: contractDetails,
    });
  }
});

app.post("/store", (req, res) => {
  let { address, arbiter, beneficiary, value } = req.body;

  if (!address || !arbiter || !beneficiary || !value) {
    res.status(400).send({ succuess: false, message: "Details not found" });
  } else {
    contractDetails.push({
      address: address,
      arbiter: arbiter,
      beneficiary: beneficiary,
      value: value,
      isApprove: false,
    });
    res.status(200).send({
      succuess: true,
      message: "Details saved",
      contractDetails: contractDetails,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
