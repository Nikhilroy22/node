const { exec } = require("child_process");

exec("node -v", (error, stdout, stderr) => {
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Output:", stdout);
});