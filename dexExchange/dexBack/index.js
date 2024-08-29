const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3007;

app.use(cors());
app.use(express.json());

// Utility function to validate Ethereum addresses
function isValidEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

app.get("/tokenPrice", async (req, res) => {
  try {
    const { query } = req;

    // Validate addresses
    if (!isValidEthereumAddress(query.addressOne) || !isValidEthereumAddress(query.addressTwo)) {
      return res.status(400).json({ error: "Invalid address provided" });
    }

    // Fetch token prices
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice
    };

    return res.status(200).json(usdPrices);

  } catch (error) {
    console.error("Error fetching token prices:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});
