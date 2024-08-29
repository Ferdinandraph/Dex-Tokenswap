const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3005;

require("dotenv").config();

app.use(cors());

const INCH_API_KEY = process.env.INCH_API_KEY;
const BASE_URL = 'https://api.1inch.dev/swap/v6.0/1';

const sanitizeAddress = (address) => address.trim();

app.get('/approve/allowance', async (req, res) => {
  try {
    const { tokenAddress, walletAddress } = req.query;
    const sanitizedWalletAddress = sanitizeAddress(walletAddress);

    const response = await axios.get(`${BASE_URL}/approve/allowance`, {
      headers: {
        "Authorization": `Bearer ${INCH_API_KEY}`
      },
      params: {
        tokenAddress,
        walletAddress: sanitizedWalletAddress
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching allowance:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.get('/approve/transaction', async (req, res) => {
  try {
    let { tokenAddress, amount } = req.query;

    // Log the received parameters for debugging
    console.log('Received parameters before sanitization:', { tokenAddress, amount });

    // Sanitize input parameters
    tokenAddress = tokenAddress.trim();
    amount = amount.trim();

    // Log the sanitized parameters for debugging
    console.log('Sanitized parameters:', { tokenAddress, amount });

    if (!tokenAddress) {
      return res.status(400).json({ error: 'Bad Request', description: 'tokenAddress has not provided' });
    }

    const response = await axios.get(`${BASE_URL}/approve/transaction`, {
      headers: {
        "Authorization": `Bearer ${INCH_API_KEY}`
      },
      params: {
        tokenAddress,
        amount
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.get('/swap', async (req, res) => {
  try {
    const { fromTokenAddress, toTokenAddress, amount, fromAddress, slippage } = req.query;
    const response = await axios.get(`${BASE_URL}/swap`, {
      headers: {
        "Authorization": `Bearer ${INCH_API_KEY}`
      },
      params: {
        fromTokenAddress,
        toTokenAddress,
        amount,
        fromAddress,
        slippage
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching swap:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
