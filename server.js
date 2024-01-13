const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

mongoose.connect('mongodb+srv://root:root@cluster.karw6nc.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const Marker = mongoose.model('Marker', {
  lat: Number,
  lng: Number,
  name: String,
  contacts: [{ name: String, phone: String, details: String }],
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/storeMarkers', async (req, res) => {
  try {
    const markers = req.body.markers;
    await Marker.deleteMany();
    await Marker.insertMany(markers);
    console.log('Markers stored successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error storing markers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/retrieveMarkers', async (req, res) => {
  try {
    const markers = await Marker.find();
    console.log('Markers retrieved successfully');
    res.json({ markers });
  } catch (error) {
    console.error('Error retrieving markers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
