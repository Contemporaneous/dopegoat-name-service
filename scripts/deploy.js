const fs = require("fs");
const path = require('path');

// source to copy content
const src = path.join(__dirname, '..', 'artifacts', 'contracts', 'Domain.sol', 'Domains.json');
// destination for copied content
const dest = path.join(__dirname,'..','src','utils','contractABI.json');

const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy("dgtest");
    await domainContract.deployed();
  
    console.log("Contract deployed to:", domainContract.address);
  
    // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
    let txn = await domainContract.register("Origin",  {value: hre.ethers.utils.parseEther('0.01')});
    await txn.wait();
    console.log("Minted domain origin.dgtest");
  
    txn = await domainContract.setRecord("Origin","Name", "Origin");
    await txn.wait();
    txn = await domainContract.setRecord("Origin","Favourite Food", "Goats");
    await txn.wait();
    console.log("Set records for origin.dgtest");
  
    const address = await domainContract.getAddress("Origin");
    console.log("Owner of domain origin:", address);
  
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}
  
const runMain = async () => {
    try {
        await main();
        fs.copyFile(src, dest, (error) => {
            // incase of any error
            console.log("Lets Copy the ABI file");
            if (error) {
              console.error(error);
              return;
            }
            
            console.log("Copied Successfully!");
        });
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
  
runMain();