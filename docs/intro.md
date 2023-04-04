---
sidebar_position: 1
---

# Quick Start
This page will walk you through installing the Collaborative CoinJoin demo and participating in your own CoinJoin session.

## What is CoinJoin?

While most transactions in Bitcoin degrade your privacy, [CoinJoin](https://en.bitcoin.it/wiki/CoinJoin) is a special configuration of transaction inputs and outputs that *improves* your privacy. Collaborative CoinJoin is a framework for BCH wallet software, to allow users to *collaborate* with one another, in order to generate CoinJoin transactions.

To understand why CoinJoin is valuable, you must first understand the concept of [UTXOs](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-outputs-and-inputs). After several spends, an HD wallet will end up with several small UTXOs that have *low monetary value, but high information content*. The information in those UTXOs can be used to deanonymize you. A CoinJoin transaction allows you to safely consolidate those UXTOs into a single *high monetary value, but low information content* UTXO, thus preserving your privacy.

## Getting Started

Collaborative CoinJoin is currently in development. There is not yet a graphical user interface (GUI). If you are a JavaScript developer, you can follow the directions below to run your own CoinJoin demonstration, using the command line wallet.

<iframe width="639" height="359" src="https://www.youtube.com/embed/gJEeVWsZDDM" title="Collaborative CoinJoin Quick Start" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Install the command-line wallet

Install the command line wallet with the following commands:

```bash
git clone https://github.com/bch-coinjoin/hd-cli-wallet
cd hd-cli-wallet
npm install
```

### Create a wallet

Create a wallet and get an address for it:

```bash
./bin/run create-wallet -n test01 -d "test coinjoin wallet"
./bin/run get-address -n test01
```

Those commands will create a new wallet and generate an address to fund it. Send a about $0.10 worth of BCH to the wallet.

### Generate UTXOs

A UTXO is an *unspent transaction output*. These are the 'bitcoins' that get spent. CoinJoin is used to safely consolidate many small UTXOs with *low monetary value*, but *high information content*, into a single UTXO that has *high monetary value*, and *low information content*.

The first step to testing Collaborative CoinJoin is to generate many small UTXOs. After funding your new wallet, you can generate UTXOs with this command:

```bash
./bin/run split-utxo -n test01
```

That will generate five UTXOs that you can then combine in a CoinJoin transaction.

## Install the API Server

Just like you installed the command-line wallet. You now need to install the API server. The API server runs an [IPFS node](https://ipfs.io), which allows it to find other wallet users that want to participate in CoinJoin transactions with you.

**Open a second terminal** and run these commands:

```bash
git clone https://github.com/bch-coinjoin/colab-coinjoin-api
cd colab-coinjoin-api
npm install
```

## Participate in a Collaborative CoinJoin

In the terminal with the API server, start the server with this command:

- `npm start`

Wait a few seconds to let the API server start up. Then, in the terminal with the command-line wallet, run this command:

- `./bin/run coinjoin-single -n test01`

The API server will being monitoring the network, looking for other wallets who want to participate in a CoinJoin transaction. If it finds one, it will attempt to collaborate. If successful, your UTXOs will be combined into one or two new UTXOs.

Combining UTXOs is not a hard thing to do, but it can not be done alone without linking all the addresses. It is this address linking that degrades your privacy. Doing it through a CoinJoin transactions actually *restores* your privacy by breaking the informational links between addresses.
