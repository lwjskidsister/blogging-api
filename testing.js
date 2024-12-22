const bcrypt = require("bcrypt");

async function testPassword() {
    const plainPassword = "test123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log("Plain:", plainPassword);
    console.log("Hashed:", hashedPassword);

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password valid:", isValid);
}

testPassword();
