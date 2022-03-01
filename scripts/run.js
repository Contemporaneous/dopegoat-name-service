const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy("dgt");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);
    
    //register
    let txn = await domainContract.register("Bill",{value: hre.ethers.utils.parseEther('0.3')});
    await txn.wait();

    let balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

    try {
      txn = await domainContract.connect(randomPerson).withdraw();
      await txn.wait();
    } catch(error){
      console.log("Could not rob contract");
    }

    //get owner
    let domainOwner = await domainContract.getAddress("Bill");
    console.log("Owner of domain:", domainOwner);

    //setrecord
    txn = await domainContract.setRecord("Bill","Name","Bill");
    await txn.wait();

    txn = await domainContract.setRecord("Bill","Favourite Food","Meat");
    await txn.wait();

    //getrecord
    let recName = await domainContract.getRecord("Bill","Name");
    let recFood = await domainContract.getRecord("Bill","Favourite Food");
    console.log(`Bill's name is ${recName} and his favourite food is ${recFood}`);

    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

    txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
    console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

    //register
    txn = await domainContract.connect(randomPerson).register("Kevin",{value: hre.ethers.utils.parseEther('0.1')});
    await txn.wait();

    //get owner
    domainOwner = await domainContract.connect(randomPerson).getAddress("Kevin");
    console.log("Owner of domain:", domainOwner);

    //setrecord
    txn = await domainContract.connect(randomPerson).setRecord("Kevin","Name","Kevin");
    await txn.wait();

    txn = await domainContract.connect(randomPerson).setRecord("Kevin","Favourite Food","Lettuce");
    await txn.wait();

    //getrecord
    recName = await domainContract.getRecord("Kevin","Name");
    recFood = await domainContract.getRecord("Kevin","Favourite Food");
    console.log(`Kevin's name is ${recName} and his favourite food is ${recFood}`);

    balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

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