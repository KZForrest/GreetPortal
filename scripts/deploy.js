const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const greetContractFactory = await hre.ethers.getContractFactory(
    "GreetPortal"
  );
  const greetContract = await greetContractFactory.deploy();
  await greetContract.deployed();

  console.log("GreetPortal address: ", greetContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
