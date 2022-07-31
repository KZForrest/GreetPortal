const main = async () => {
  const greetContractFactory = await hre.ethers.getContractFactory(
    "GreetPortal"
  );
  const greetContract = await greetContractFactory.deploy();
  await greetContract.deployed();
  console.log("Contract deployed to:", greetContract.address);

  let greetCount;
  greetCount = await greetContract.getTotalGreets();
  console.log(greetCount.toNumber());

  let allGreets = await greetContract.getAllGreets();
  console.log(allGreets);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without erro
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
