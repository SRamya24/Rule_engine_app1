const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ruleRoutes = require('./routes/ruleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost/rule-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(bodyParser.json());

// Routes
app.use('/api/rules', ruleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
