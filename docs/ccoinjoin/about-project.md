---
sidebar_position: 1
---

# About the Project

The Collaborative CoinJoin project was created from a Flipstarter campaign funded by the Bitcoin Cash community. It approaches the design of a CoinJoin wallet by identifying the five primary design elements. These elements are loosely coupled, so that developers can collaborate and innovate on one element at a time.

## Five Design Elements

There are *five design elements* that go into a desktop application for generating CoinJoin transactions:

1. **Packaging** - This is the desktop app using [Electron.js](https://www.electronjs.org/). It will be compiled and tested on Windows, Mac, and Linux. The UI will closely resemble [wallet.FullStack.cash](https://bchn-wallet.fullstack.cash).
2. **Back End Infrastructure** - This is the part that communicates with the blockchain. It uses the [web3 Cash Stack](https://cashstack.info/).
3. **HD wallet functionality** - This is handled by [hd-cli-wallet](https://github.com/bch-coinjoin/hd-cli-wallet). It generates new addresses from a 12-word mnemonic, and optimizes UTXO handling to preserve privacy.
4. **p2p coordination** - This is largely handled by the [ipfs-coord](https://www.npmjs.com/package/ipfs-coord) library and the [colab-coinjoin-api](https://github.com/bch-coinjoin/colab-coinjoin-api) 'API server'. This design element allows players to coordinate with one another over IPFS, without the need for a centralized server.
5. **CoinJoin protocol** - [The Collaborative CoinJoin protocol](https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps004-collaborative-coinjoin.md) has been developed and adapted from [this CoinJoin code example](https://github.com/Permissionless-Software-Foundation/psf-js-examples/tree/master/bch-js/bch/applications/collaborate/coinjoin). In the future, better (but harder to develop) CoinJoin protocols like [CashShuffle](https://github.com/cashshuffle/spec) and [CashFusion](https://cashfusion.org/) can be swapped in later, without having to change the other four design elements.

## Code Repositories

The following code repositories make up the Collaborative CoinJoin framework:

- [hd-cli-wallet](https://github.com/bch-coinjoin/hd-cli-wallet) is the HD wallet 'engine'. This library can create new wallets, manage UTXOs within an HD wallet context, and send BCH and tokens. It communicates with the colab-coinjoin-api REST API in order to consolidate UTXOs through CoinJoin. It provides a command-line interface (CLI) for developers, and it also exports its functionality into an npm library that is compiled for use in a web browser UI. That library is used by the electron-bch-coinjoin-wallet user interface.

- [colab-coinjoin-api](https://github.com/bch-coinjoin/colab-coinjoin-api) is a REST API server. It is embedded in electron-bch-coinjoin-wallet, and it can be operated as a stand-alone webserver. It spins up a go-ipfs node at startup, to provide p2p communication. It also provides a REST API for the front web UI and the command-line wallet. It also provides a JSON RPC over IPFS, for communicating with other CoinJoin players.

- [electron-bch-coinjoin-wallet](https://github.com/bch-coinjoin/electron-bch-coinjoin-wallet) is an Electron.js desktop app the wraps the above two code repositories. This *is* the final desktop app. In addition to the desktop user interface, it includes an embedded copy of [go-ipfs](https://ipfs.io) for p2p communication, and a copy of colab-coinjoin-api as a back-end REST API. The user interface is based on [wallet.fullstack.cash](https://bchn-wallet.fullstack.cash).

## CoinJoin Workflow

The flowchart below illustrates how messages are passed between peers to collaborate on a CoinJoin transaction. Each peer has a wallet ([hd-cli-wallet](https://github.com/bch-coinjoin/hd-cli-wallet)) and access to an instance of this colab-coinjoin-api (*API server*). Wallets and *API servers* pass information using a REST API. *API servers* talk to one another using a JSON RPC via [IPFS](https://ipfs.io) pusub channels.

The diagram below shows the workflow of creating a CoinJoin transaction with two peers. One peer is always chosen as a 'coordinator'. The coordinator is the peer that initiates the Collaborative CoinJoin session, compiles the final transaction, and broadcasts it. In the example below, **Peer 1** is the coordinator.

![coinjoin flowchart](./img/coinjoin-flowchart.png)

### Initiating a CoinJoin Transaction
All peers begin the Collaborative CoinJoin protocol the same way. The wallet makes a call to the `POST /wallet` REST API endpoint of their local *API server*. With that call, the wallet passes information about the UTXOs that it wants to consolidate through a CoinJoin transaction. The *API server* will periodically announce its desire to join a CoinJoin transaction by [soliciting for CoinJoin Participation as per the Collaborative CoinJoin specification](https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps004-collaborative-coinjoin.md#5-soliciting-for-coinjoin-participation).

As new announcements are made, each instance of the *API server* will track the other potential CoinJoin peers. Once any peer has detected enough potential peers to start a Collaborative CoinJoin, it will initiate a round by calling the `/initiate` JSON RPC endpoint on the selected peers. Each peer will respond with the UTXOs they want to add to the transaction.

### Building a CoinJoin Transaction
If all peers respond to the coordinator-peer, then the coordinator-peer will execute its `initiateColabCoinJoin()` function to compile all the information from the peers into an unsigned CoinJoin transaction. It then sends a copy of the unsigned CoinJoin transaction to each peer.

Once a peer receives the unsigned transaction, it will pass it on to the wallet. The wallet will poll an endpoint on the *API server*, to detect when an unsigned transaction has arrived. Once detected, the wallet software will validate the transaction and then sign the inputs that belong to the wallet. The partially signed transaction is then passed from the wallet to the *API server* via the REST API. The *API server* then passes the partially signed transaction to the coordinating-peer via the `/pstx` IPFS JSON RPC.

### Broadcasting a CoinJoin Transaction
The coordinating-peer will collect the partially signed transactions from all peers. Once they have all been collected, the coordinating-peer will compile them into a fully signed transaction and broadcast it to the BCH network.
