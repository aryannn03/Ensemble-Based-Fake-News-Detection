require("dotenv").config();
const app = require("./app");
const { connect } = require("./config/database");

const PORT = process.env.PORT || 8000;

// Connect to database
connect();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
