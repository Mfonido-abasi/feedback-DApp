const hre = require("hardhat");

async function main() {
    const FeedbackDApp = await hre.ethers.getContractFactory("FeedbackDApp");
    const feedbackDApp = await FeedbackDApp.deploy();
    await feedbackDApp.waitForDeployment();

    console.log("Contract deployed to:", await feedbackDApp.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});