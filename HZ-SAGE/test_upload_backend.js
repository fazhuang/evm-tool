const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  const form = new FormData();
  form.append('file', fs.createReadStream('/Users/likeming/.gemini/antigravity/scratch/HZ-SAGE/test_bid.txt'));

  try {
    const response = await axios.post('http://localhost:8000/api/v1/review/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer hz_sage_secure_token_2026'
      }
    });
    console.log('Upload Success:', JSON.stringify(response.data.filename, null, 2));
  } catch (error) {
    console.error('Upload Failed Status:', error.response?.status);
    console.error('Upload Failed Data:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
  }
}

testUpload();
