const express = require('express');
const path = require('path');

const router = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
}

module.exports = router;
