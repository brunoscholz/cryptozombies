require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    development: {
      host: "ganache-cli",   // Ganache
      port: 8546,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','),
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      // gas: 29999972,
      // gasPrice: 100000000,
      network_id: 5,
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 42,
      skipDryRun: true,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 4,
      skipDryRun: true,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 3,
      skipDryRun: true,
    },
    main: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://main.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 1,
    },
    polygon: {
      provider: () =>
        new HDWalletProvider(
          privateKeys.split(","),
          `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_ID}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    polygonMainNet: {
      provider: () =>
        new HDWalletProvider(
          privateKeys.split(","),
          `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_ID}`
        ),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 137,
    },
  },
  contracts_directory: "./src/truffle/contracts/",
  contracts_build_directory: "./src/truffle/abis/",
  migrations_directory: "./src/truffle/migrations/",
  test_directory: "./src/truffle/test/",

  compilers: {
    solc: {
      version: ">=0.6.0 <0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
