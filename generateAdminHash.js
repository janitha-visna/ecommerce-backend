const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "123"; // <-- your desired admin password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:\n", hashedPassword);
}

generateHash();
