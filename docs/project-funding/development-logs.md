---
sidebar_position: 3
---

# Development Logs

This page captures the development logs from the first funding campaign. This information is posted in the spirit of transparency, so that funders can see exactly how their funds were spent.

In this first funding round, all development was executed by [Chris Troutner](https://github.com/christroutner). The logs are taken from his personal log book.


## Funding Campaign 1 - Logs

### 4/3
- started at 1PM. Stopped at 4PM. = 3 hrs

Wrapping up the first blog post.

Created quick start video.

Added flowchart to documentation.

### 4/2
- started at 1:15AM. Stopped at 2:15AM. = 1 hr
- started at 9:30AM. Stopped at 10AM. = 0.5 hr
- started at 11:15AM. Stopped at 12:15PM. = 1 hr
- started at 6:15PM. Stopped at 7:15PM. = 1 hr


Continued working on the documentation site.

Started creating a summary blog post.

BCH prices

10/20 - 107
11/4 - 125 16%
11/27 - 106
11/8 - 89

Registered ccoinjoin.com and working on standing up website.


### 4/1
- started at 4:45PM. Stopped at 5:45PM. = 1 hr
- started at 7:30PM. Stopped at 8:30PM. = 1 hr

I'm officially over the hours I said that I'd put in when I launched the Flipstarter. It's time to wrap up the project.

Working today on creating a Docusaurus site to document the project.


### 3/28
- started at 6:30AM. Stopped at 10AM. = 3.5 hrs
- started at 1:15PM. Stopped at 3:15PM. = 2 hrs
- started at 5PM. Stopped at 6:30PM. = 1.5 hr

Continuing to add unit test coverage of the use-case library for colab-coinjoin-api.
Left off on sendPartiallySignedTx(). That's the next function that needs unit tests.

Got the use-case library up to 100% unit test coverage. Got the transaction reliability up significantly.

In the evening, I worked on the hd-cli-wallet to refine its usage so that others can easily test the CoinJoin prototype.
- Created a split-utxo command to generate 5 UTXOs.
- Did some additional testing. Got a great demo ready for tomorrow's PSF TSC meeting.

### 3/27
- started at 7AM. Stopped at 11:15AM. = 4.25 hr
- started at 3:15PM. Stopped at 4:15PM. = 1 hr
- started at 5:30PM. Stopped at 7PM. = 1.5 hr

Reviewed and made some edits to the workflow documentation.

I tried to shoot a demo video, but the software is just too flaky. There are too many race conditions to reliably generate a transaction.

Started refactoring the API software to add unit tests and gain more reliable operation.

In the afternoon, I focused primarily on increasing the unit test coverage of the CoinJoin use-case library.



### 3/26
- started at 7:15AM. Stopped at 12:30PM. = 5.25 hr
- started at 2:45PM. Stopped at 4:45PM. = 2 hrs

Continued debugging and development of the coinjoin implementation.

Got the first successful CoinJoin transactoin broadcasted!
https://blockchair.com/bitcoin-cash/transaction/fe3f0b5d0bbd2bc71a85ab108fd29d24afb4e8541ba834825fe58aa654dc1aae

Documenting the workflow between major pieces of software:

Four entities:
- Peer 1 wallet (hd-cli-wallet)
- Peer 1 API server (colab-coinjoin-api)
- Peer 2 API server (colab-coinjoin-api)
- Peer 2 wallet (hd-cli-wallet)

(Peer 1 wallet) coinjoin-single → REST API /wallet → Peer 2 API server → IPFS Announce
 - In this step, the wallet passes UTXO information to the API server. The server then announces itself on the IPFS coinjoin pubsub channel.
 - The wallet periodically polls the API server to see if it has an unsigned CoinJoin transaction that needs to be signed.

(Peer 2 API server) announce → IPFS pubsub → (Peer 1 API server) handleCoinJoinPubsub() → (Peer 1 API server) JSON RPC /initiate
 - In this step peers periodically announce themselves to the IPFS pubsub channel. When a peer has observed enough compatible peers, it will solicite a request to form a CoinJoin transaction by issuing an /initiate call over the IPFS JSON RPC.

(Peer 2 API server) handleInitRequest() → IPFS JSON RPC → (Peer 1 API server) get UTXOs, output addresses, and change addresses
 - In this step, Peer 2 responds to the /initiate call with the UTXOs, output addresses, and change addresses it wants to add to the CoinJoin transaction.

(Peer 1 API server) create TX → IPFS JSON RPC /sign → (Peer 2 API Server) add unsigned TX to state
 - In this step the 'coordinating' peer generates an unsigned CoinJoin transaction and passes it back to each peer via the IPFS JSON RPC /sign endpoint. The unsigned transaction is stored in the servers state (or database) and is returned to the wallet for signing in the next step.

(Peer 2 wallet) coinjoin-single → REST API /wallet/unsignedTx (polling) → (Peer 2 API server) return unsigned TX from state
(Peer 1 wallet) coinjoin-single → REST API /wallet/unsignedTx (polling) → (Peer 1 API server) return unsigned TX from state
 - When the wallets issue the coinjoin-single command, they begin periodically polling the API server for an unsigned transaction. When the server has a transaction to sign, it will pass it back to the wallet for signing. The wallet validates the transaction inputs and outputs, signs the input belonging to the it, and returns the partially signed transaction to the server.

(Peer 2 wallet) coinjoin-single → REST API /wallet/partiallySignedTx → (Peer 2 API server) sendPartiallySignedTx() → JSON RPC → (Peer 1 API server) /pstx
 - In this step the wallet validates then partially signs it's copy of the CoinJoin transaction. It returns the partially signed transaction to the API server via the REST API. The API server then passes the partially signed transaction to the 'coordinating' peer via the IPFS JSON RPC.

(Peer 1 API server) combineSigs() → (Peer 1 wallet) broadcast TX
 - In this final step, the 'coordinating' peer compiles all the partially signed copies into a fully signed transaction and broadcasts it to the network, completing the CoinJoin transaction.

Merged all code and DIA diagram into the main repository for colab-coinjoin-api:
https://github.com/bch-coinjoin/colab-coinjoin-api/pull/11




### 3/25
- started at 10:15AM. Stopped at 11AM. = 0.75 hr
- started at 12PM. Stopped at 2:45PM. = 2.75 hr

Successfully passed RPC data to the coordinating peer. Next step is to add an RPC handler so the coordinating peer can respond.

Created RPC handler that can now combine transactions.

Next step is to dig into the collectSignatures() function and the cjPeers object. The coordinating peer needs to create its own local copy of the cjPeer data for itself. When combineSigs() is called, it needs to know what UTXOs belong to the coordinating peer, and it needs a partially signed TX from the coordinating peer.

### 3/23
- started at 8:30AM. Stopped at 10:30AM. = 2 hrs

Passed partially signed TX from wallet client to colab-coinjoin-api via the /wallet/partiallySignedTx endpoint.

Left off debugging sendPartiallySignedTx() in colab-coinjoin-api. I'm trying to pass the partially signed TX back to the coordinator peer.


### 3/10
- started at 6:30AM. Stopped at 11:15AM. = 4.75 hr

Since I don't want the API server to hold any private keys, the hd-cli-wallet app needs to poll a REST API endpoint every 10 seconds, waiting for an unsigned TX with UTXOs that it needs to sign and pass back.

Today I got the coinjoin-single command in hd-cli-wallet to poll a REST API endpoint on colab-coinjoin-api after submitting UTXOs for coinjoin. Once the peers coordinate to create an unsigned CoinJoin TX, the unsigned TX is passed back to hd-cli-wallet through the polling. hd-cli-wallet then signs the UTXOs in the TX that belong to it, and recompiles the partially-signed TX into a hex string, to be passed back to colab-coinjoin-api.

Next Steps:
- pass the partially-signed TX back to colab-coinjoin-api through the REST API
- colab-coinjoin-api needs to pass the paritally signed TX back to the coordinating peer
- Once the coordinating peer has all partially-signed TXs, it needs to combine them into a fully-signed TX and broadcast it.


### 3/8
- started at 6:30AM. Stopped at 7:30 = 1 hr

Testing to see if I can successfully generate and pass an unsigned TX to all peers.
- Hex is successfully generated. Next step is to for each participant to sign their inputs and pass it back.

Was able to successfully pass the unsigned TX to each peer using the new /sign JSON RPC endpoint.

Next steps:
- Port the code from part 3 of the CoinJoin example code into the new signTx() use case.


### 3/7
- started at 6:30AM. Stopped at 7:45AM. = 1.25 hr
- started at 4:45PM. Stopped at 6:15PM. = 1.5 hr

I created and debugged the buildCoinJoinTx() function in colab-coinjoin-api. This function aggregates all the data from the initiating node and all peers. All data is now ready to pass on to an adapter library for creating the unsigned CoinJoin TX.

Next steps:
- Create adapter library that compiles the CoinJoin transaction based on output of buildCoinJoinTx()
- Pass the CoinJoin TX to each peer for signing.

----

Running through the CoinJoin examples in psf-js-examples repository:
https://github.com/Permissionless-Software-Foundation/psf-js-examples/tree/master/bch-js/bch/applications/collaborate/coinjoin

Created an algorithm for generating an unsigned CoinJoin transaction in hex format. Added unit test for it.


### 3/6/23
- started at 5:30PM. Stopped at 7:45PM. = 2.25 hr

Adjusted the timeout when waiting for RPC response to coinjoin initiation.

It looks like the response from the second peer is not making it back to the first peer, and the JSON RPC is timing out.

Found and fixed the issue that was preventing the peer's response from being processed by the initiator.

### 3/4/23
- started at 7AM. Stopped at 9:45AM. = 2.75 hr

I'm at section 6.1 of the spec, where a peer needs to respond with the inputs and outputs. I need to create library functions in hd-cli-wallet that can:
- Find the most appropriate UTXOs to use in the CoinJoin
- Generate addresses and amounts for the outputs. There will be two: one for the CoinJoint output, and one of the change.

I created the selectCoinJoinUtxos() function in the hd-cli-wallet utxos.js library. This can be used to select UTXOs for the CoinJoin.

Next steps is to:
done - integrate selectCoinJoinUtxos() into the RPC response to initiate a CoinJoin.
done - Also need to generate and pass in two addresses from the peer
done - Initiator needs to check that the submitted UTXOs exceed the amount of sats required from that peer, and reject if not.

Next steps:
- The JSON RPC call times out on the initiating peer while waiting for the other peer to update their UTXOs. The timeout for the JSON CoinJoin initiator call needs to be extended to 2 minutes.


### 3/3
- started at 7AM. Stopped at 8:45AM. = 1.75 hr

Got the JSON RPC between two peers working. Got one peer to respond to an 'initiate' command to see if they want to start a CoinJoin transaction. I'm ready to start adding code to the response.

The next step is to code up section 6.1 of the collaborative coinjoin spec, where the peer responds with the UTXOs they want to add to the coinjoin transaction, and the output they want.

Before continuing on too far with the protocol, it would be a good idea to shore up the progress I've made in colab-coinjoin-api with unit tests. A lot of the code from here is going to be the same as what I've already created, with handling for corner cases.

There will need to be a transaction fee to pay for gas, which can't be known ahead of time. I think each user to plan to contribute 546 sats to pay for gas. If that works reliably, then any leftover amounts can be sent to the PSF burn-app.


### 3/2
- started at 4:30AM. Stopped at 8AM. = 3.5 hrs

Using CLI wallet to pass UTXOs via REST API, then that data updates the CoinJoin Announcement pubsub message, allowing peers to find one another and initiate a CoinJoin.

Made some progress with getting two peers to communicate the minimum amount of data to start a CoinJoin transaction.

Next steps:
- I need to copy the JSON RPC workflow from ipfs-bch-wallet-consumer into colab-coinjoin-api. The workflow from here on out expects a response, so it makes a lot of sense to leverage the JSON RPC workflow.

### 3/1
- started at 4PM. Stopped at 5PM. = 1 hr

Instead of passing mnemonic to the back-end server, I should pass the UTXOs that need to be CoinJoined. The back end can pass a partially signed TX back to the client for signing.

Created new 'coinjoin-single' command in hd-cli-wallet. It passes UTXOs to colab-coinjoin-api via the REST API, to kick off a CoinJoin session.


### 2/28
- started at 7AM. Stopped at 8:30AM. = 1.5 hr

Fixed broken unit tests.

Created prototype REST API endpoint for starting CoinJoin sessions.

Started integration wallet libraries into the coinjoin API.


### 2/25
- started at 5:45AM. Stopped at 6:45AM. = 1 hr
- started at 7:30AM. Stopped at 8:30AM. =  1 hr
- started at 10:30AM.  Stopped at 1PM. = 2.5 hr

Working on announcements and detection of peers who want to engage in CoinJoin txs.
- Added template for timer controller library to ipfs-service-provider and pulled that change into colab-coinjoin-api.
- Added the ability to announce the nodes information on the coinjoin pubsub channel.

Next steps:
Done - A new 'cjPeer' entity should be created to track coinjoin peers.
- tests needs to be fixed.
- A REST API needs to be created so that the front end or CLI can pass the mnemonic and kick off a coinjoin process.
- A new cjPeer database entry should be created, and CRUD use-cases
- The code from ipfs-coord for detecting announcements of other peers should be ported to colab-coinjoin-api
- Once 2 other peers have been found, it can trigger the start of the collaborative coinjoin protocol.



### 2/24
- started at 1PM. Stopped at 2PM. = 1 hr

Adding 'bch-coinjoin' channel to ipfs-coord. I need the circuit relays to relay this information, so it seems best to put the code in the ipfs-coord library itself.

Pushed the changes and updated the two hard-coded circuit relays for the PSF IPFS network.
Copies of colab-coinjoin-api can now make announcements to the bch-coinjoin-001 channel to find one another.


### 2/23
- started at 8AM. Stopped at 8:45AM. Stopped at 10AM. = 1.25 hr

With the command-line wallet working, now I need to shift focus on the REST API in Electron.js between the backend server and the front end UI.

- Added a GET /wallet endpoint to retrieve a mnemonic for an HD wallet from the REST API
- Merged the refactor to Functional Components from bch-wallet-web-android into electron-bch-wallet-single-addr
- Updates colab-coinjoin-api to v2.2.1
-

Note: Syncing electron-bch-wallet-single-addr with the upstream bch-wallet-web3-android seemed to break the Electronjs build in GitHub actions. However, I've learned not to trust that system as it's extremely fragile. I'm pushing forward and will test the ability to compile the app manually.

Got development version front end to request mnemonic for wallet from back end REST API. Testing to see if this broke the Electronjs build.



### 2/20
- started at 6:45AM. Stopped at 8:45AM. = 2 hours
- started at 12:30PM. Stopped at 1:30PM. = 1 hr

Focusing today on wrapping up the update-balance command. Trying to layout the code in a modular way, so that the subfunctions can easily be used by other programs. Also trying to achieve 100% unit test coverage for both the library and command.

Got update-balances completed. Both the command and library has 100% unit test coverage.

Added generateBchUtxos() function to update-balances library. This generates a concise array of BCH UTXOs controlled by the HD wallet.

Next steps:
- Update the get-address command. This will be needed by the send-bch command.
- Refactor the send command to use the new libraries.

Second shift. Started working on refactoring send-bch.
- Tested get-address and that worked fine.
- Got the send command working
- Created utxo.js library for utxo managmenet.

### 2/18
- started at 5:15AM. Stopped at 6:15AM. = 1 hr

Got most of the update-balance command refactored.

### 2/13
- started at 4:15AM. Stopped at 8:15AM. = 4 hrs
- started at 9:15AM. Stopped at 12:45PM. = 3.5 hr


Got the most basic part of the create-wallet command into a separate library, and verified that it can be Browserified into a library for use within a JS browser environment.

Updated the main GitHub project README with descriptions of the repositories and how they fit together:
https://github.com/bch-coinjoin

Ran into some issues with the ipfs-bch-wallet-consumer changes that were recently made for this project. Spent some time debugging.
- Ended up being user error. I was using the wrong URL.

Worked on the create-wallet and update-balance commands in hd-cli-wallet.
- Got unit tests for new libraries to 100% coverage.
- Created getAllAddressData() function that gets balances and UTXOs for all the addresses in the HD wallet.

Next steps:
- Recreate the update-balances command using the new library functions.

### 2/12
- started at 12:15PM. Stopped at 12:45PM. = 0.5 hr
- started at 2PM. Stopped at 2:15PM. = 0.25 hr

Before getting to the next steps listed in the last task, I'm going to fix the tests and make sure the hd-cli-wallet library can be browserified and included in the front-end app. It's going to be needed there, and it doesn't make any sense to work on the code if that part doesnt work.

Browserify had issues with oclif. What I need to do is separate the wallet logic from the command-line app logic by creating a new set of libraries.

Started refactoring the create-wallet command into its own library.



### 2/9
- started at 6:30AM. Stopped at 8:30AM. = 2 hrs

Created v1.4.4 of bch-consumer that accepts an array of addresses for retrieving UTXOs.

The oclif package used in slp-cli-wallet and hd-cli-wallet is horribly outdated, and most of the code needs to be refactored. It would probably be better to start with a new oclif project, as long as it's not in ESM format.
 - Nevermind! don't fuck with something that isn't broken. The current version of oclif works, is not in Typescript, and is not in ESM format. I'll move forward with that.

Next steps for hd-cli-wallet:
- Create a new getAllAddressData() function that scans the last 100 addresses generated from the wallet.
  - The old version scans every address, which is needed, but the default behavior should just be the last 100 addresses.
  - Instead of stopping scanning based on balances, scanning should stop based on transaction history.
- Create a new getAddressData() function that uses the new function calls in bch-consumer

### 2/8
- started at 5AM. Stopped at 7AM. = 2 hrs
- started at 11:45AM. Stopped at 3:15PM. = 3.5 hrs


Added utxosBulk endoint to ipfs-bch-wallet-service.
Turns out that bulk queries are already supported for balance calls.
Got ipfs-bch-wallet-service back up to 100% unit test coverage.

Started working on ipfs-bch-wallet-consumer to add bulk UTXO endpoints.
- Got bulk UTXO queries added to ipfs-bch-wallet-consumer

Added bulk UTXO calls to bch-consumer, but still needs unit tests. Took a bit of time to test the whole stack and ensure I was getting the expected output.


### 2/7
- started at 7AM. Stopped at 7:30AM. = 0.5 hr
- started at 7:45AM. Stopped at 11:15AM. = 3.5 hr

Got fulcrum, full-node, and SLP indexer synced over night. Ready to start working on the upgrades to bch-api, bch-js, and the higher cash stack libs.

Updated bch-api and bch-js so that their default behavior is to return transaction histories in descending order (most recent first), and they only return the last 100 txs be default. These changes will be really important to scale, as the HD wallets will be hitting them really hard.

Started working on bulk balance and UTXO calls for the Cash Stack.
- prototyped utxo bulk endpoing in ipfs-bch-wallet-service. Need to add tests

### 2/6
- started at 4AM. Stopped at 7:30AM. = 3.5 hr
- started at 8:30AM. Stopped at 10:45AM. = 2.25 hr
- started at 12PM. Stopped at 1PM. = 1 hr

Continued in my effort to try and get Mac to compile the Electronjs app. The MacOS v11 VM that I have kept crashing. I had access to a laptop running MacOS v10, and it refused to build a dependency, asking me to upgrade to v11 or higher.

At this point I have no option but to continue with the build for Linux and Windows, and hope that I can figure out a solution for Macs.

Since the GitHub action script is no longer an option or a concern, I'm reverting back to this build:
159b54dec38cf8e8b9a477d831c19bff8ff38192

And I'm going to see if I can still get the executable to build in Linux and Windows. In that build, I'm still using the colab-coinjoin-api, which is the perferred way to build this app. That keeps the back-end modular and easy to test.

I confirmed that the build runs fine on Linux. Though, I need to understand more about MongoDB and how that works in terms a dependency. Is it getting packaged with Electron? Can I disable the dependency on Mongo?

I removed MongoDB as a dependency in v2.2.0 of colab-coinjoin-api.

Forked slp-cli-wallet in to hd-cli-wallet. This will be the HD wallet engine used to send and recieve BCH and SLP tokens.

The HD wallet will need to get *balances*, *transaction history*, and *utxo* for a block of 20 addresses (bulk) at a time, in order for the UX not to suck. The transaction history is already supported, but I'll need to add bulk endpoints to the following libraries:
- ipfs-bch-wallet-consumer, ipfs-bch-wallet-service, bch-consumer

My fulcrum indexer corrupted its database while trying to update. I need to stop, restore the backup, and resync.

### 2/5
- started at 4PM. Stopped at 4:30 = 0.5 hr
- started at 5:30. Stopped at 6PM. = 0.5 hr

Setting up dev env on the MacOS and trying to compile the Electronjs app.

Got node.js, firefox, and remote login working on the mac.

### 2/2
- started at 5:45AM Stopped at 9AM. = 3.25 hr
- started at 2:15PM. Stopped at 3PM. = 0.75 hr

Here is the cross-platform Github Actions script use by jsfiddle:
https://github.com/electron/fiddle/blob/main/.github/workflows/build.yaml

Had to turn on developer mode in windows, in order to create symbolic links. This overcame the issues I was getting when running `npm install`.
I was then able to install the npm dependencies.

Build workflow:
- npm run build // Build React app
- npm run make // Package the Electron ap

Got the app to build in Windows and was able to install the EXE. Very strange 'squirrel' installer displays an animated gif while installing and asks for no input.. It's a very strange installer.

Moving on to do the same in Mac.


### 1/31
- started at 8AM. Stopped at 8:45AM. = 0.75 hr
- started at 5PM. Stopped at 7PM. = 2 hrs

Trying to build the Electron app on windows. First I need to set up the node.js dev env.
- Getting errors about symlinks. I need to reset the VM. I think I saw an option for permitting symlinks when I installed node the first time, but did not see it the second time.



### 1/28
- started at 4:45AM. Stopped at 9AM. = 4.25 hr

Installing windows and Mac OS on VirtualBox, to try and set up my own build environment for those operating systems.

I was able to install MacOS using the YouTube video link I found yesterday. It took 3.5 hrs

Started installing Windows 11 at 8:15AM.


### 1/27
- started at 3:45AM. Stopped at 6:45AM. = 3 hrs

It's very disapointing that adding colab-coinjoin-api caused the Electron build to fail without any errors. Without any feedback, I'm shooting in the dark. The only option to move forward that I can think of is to port the code directly into the Electron app, as opposed to including it as an external dependency. That way I can recreate the core functionality step-by-step and check each step to see if it breaks the build.

I started adding the functionality of colab-coinjoin-api directly into the Electron app. v1.4.0 built, but v1.5.0 did not, when I added ipfs-coord. Strange thing is that ipfs-coord has very few dependencies.

The issue turns out to be bch-js. That is what is failing the Electron builds, simply being included as a dependency. Again, with no errors. I have to assume this has to do with the incompatibilities between the Node.js OpenSSL crypto library and the BorringSSL crypto module used by Electron.

On my Linux OS, I can get the Electron to build with bch-js just fine. It's only the GitHub Action that has issues. I'm going to try and take a different approach of installing MacOS and Windows into a virtual machine and setting them up to build the Electron app, so that I don't have to rely on the GitHub Actions.

How to install MacOS on VirtualBox:
https://www.youtube.com/watch?v=Lq8J-vFqH7w

How to install Windows 11 on VirtualBox:
https://www.youtube.com/watch?v=cjE5BU_3P0o



### 1/25
- started at 10:30AM. Stopped at 12:15PM. = 1.75 hr

I let the GitHub Actions run as long as possible to try and build the ElectronJS binaries. They were auto-killed after 6 hours. They appear to be hanging. The logs did not show any obvious errors or problems. It just appears to be spinning.

The only solution I can think of is to fork the repository and try to build it up again with each step, ensureing the ElectronJS binaries compile, until I hit a point where they do not. Then can investigate.

v1.0.2 was the last successful compilation. Major changes since v1.0.2:
- Build of the fork worked.
- Builds should take less then 10 minutes

The electron GitHub actions failed to build after adding colab-coinjoin-api as a dependency. Without any logs to debug the issue, I'm poking blind. I'll probably need to create a custom REST API for the Electron app.

### 1/24
- started at 6:30AM. Stopped at 8:30AM. = 2 hrs
- started at 12:30PM. Stopped at 2PM = 1.5 hr

After publishing colab-coinjoin-api to npm, and then including it in the package.json file for electron-bch-coinjoin-wallet, I got errors about Winston. This was a new error that did not happen when I was including the package locally (not from npm).

I removed the winston adapter and /logs REST API endpoint from colab-coinjoin-api and republished. I was then able to to include it as an npm dependency.

The build is taking over 2 hours to complete. I need to look into only building the Electron output on merge. This Issue seems to have a solution:
https://github.com/orgs/community/discussions/26724

That fixes the frequency of builds, but it doesn't answer why Electron is not building.

Tried building the linux deb and rpm packages locally to see if I could find out why it's hanging so bad. The build succeeded, but running the app locally throw an error when trying to access the admin .json file. I'll remove those REST API endpoints, since they are not needed in this project.

It looks like GitHub Actions is free for public repos. So I'll just let it run.

### 1/22
- started at 7:15AM. Stopped at 10:15AM. = 3 hrs

Continuing research on the 'digest method not supported' error.
- Trying to reinstall all dependencies with node.js v14, to if this changes the error.

Other people are having similar issues:
https://stackoverflow.com/questions/74014599/nodejs-crypto-createprivatekey-fails-on-electronjs-if-the-private-key-is-encry

This could potentially be a solution?!
https://stackoverflow.com/questions/61529247/how-to-use-crypto-in-electron

The links in this GitHub issue lead me down a rabbit hole. It appears that Electron does not use OpenSSL anymore, but swapped it out for BorringSSL from the Google Chrome team.
https://github.com/nodejs/node/issues/25890

Info on the ELECTRON_RUN_AS_NODE environment variable (which does not seem to help)
https://www.electronjs.org/docs/latest/api/environment-variables#electron_run_as_node

This StackOverflow post clued me in onto the solution. I added to it to describe the specific steps that I took to solve the issue:
https://stackoverflow.com/questions/66498374/how-can-i-use-the-real-crypto-module-in-electron-js-in-the-main-process/75202437#75202437

Finally got go-ipfs and ipfs-coord working inside Electron! Whew. Lot of work.

### 1/21
- started at 1:15PM. Stopped at 4:15PM. = 3 hrs

Fixing tests the broke during the work yesterday in colab-coinjoin-api.

 Got unit tests back to 100%

When integrating the latest changes in colab-coinjoin-api into electron-bch-coinjoin-wallet, the go-ipfs node couldn't start. Something specific about Electron. I'll need to debug this.

Was able to get go-ipfs started inside Electron, by copying code from ipfs-desktop.

Once that was solved, I got another issue with ipfs-coord not wanting to create a BCH key pair for the encryption.
The error is 'Digest method not supported' and it seems to be comming from the native node.js crypto library.
Advise I can find on the internet says delete node_modules folder and package-lock.json and reinstall to fix the problem. I tried, but that didn't fix it.

### 1/20
- started at 6:45AM. Stopped at 9:30AM. = 2.75 hr

Wrestled with trying to get the go-ipfs binary to start. Finally got it.

Moved on to integrating ipfs-coord with the program. Got it working.

### 1/16
- started at 4AM. Stopped at 6:30AM. = 2.5 hr

Continuing work on creating a `cjs` branch of ipfs-service-provider.

Finished making a CommonJS code refactor of the ipfs-service-provider repository.


### 1/15
- started at 8:30AM. Stopped at 9AM. = 0.5 hr
- started at 9:45AM. Stopped at 11:15AM. = 1.5 hr
- started at 1PM. Stopped at 2:30PM. = 1.5 hr

Before getting too crazy with the coding of coinjoin-api, I decided first to create an Electron.js app that loads go-ipfs and the coinjoin-api into it.

created new repository for CoinJoin Electron app:
https://github.com/bch-coinjoin/electron-bch-coinjoin-wallet

Reviewed IPFS Desktop, which is an Electron.js app that runs go-ipfs in the background:
https://github.com/ipfs/ipfs-desktop

I can't include colab-coinjoin-api into Electron.js because it's in ESM format. I think I need to create a `cjs` branch to ipfs-service-provider for this kind of issue. That means I need to refactor ipfs-service-provider back to CommonJS format.

The goal from here is to launch colab-coinjoin-api from Electron.js. Then launch go-ipfs from colab-coinjoin-api. That is the workflow that IPFS Desktop is using.

Creating a `cjs` branch for ipfs-service-provider to provide the code in CommonJS format.

### 1/11
- started at 3PM. Stopped at 4:15PM. = 1.25 hr

Forking ipfs-service-provider into coinjoin-api. This will be the engine for CoinJoin nodes to find and communicate with one another over IPFS.
I think once I can simulate three players talking over pubsub, I can then work on the API for collaborating on a CoinJoin. I want that actual CoinJoin logic to be a separate library, but I need to get a good sense of what the API needs to look like.

After looking at the ipfs-service-provider code, I'm confident this is a great fit. The CoinJoin peers will use the JSON RPC over IPFS pubsub that I've developed for the cashstack. Same code, but just different channel. There will be an announcement channel, and then JSON commands will come over the pubsub channel.

Here is the architectural overview:
- colab-coinjoin-api is the REST API and JSON RPC coordinator that coordinates CoinJoin peers.
  - Provides REST API for the web UI and CLI to talk to.
  - Provides JSON RPC for communicating between CoinJoin peers
- collab-coinjoin-lib contains the logic for Collaborative CoinJoin, which uses the JSON RPC provides by coinjoin-api
- hd-bch-wallet is a fork of minimal-slp-wallet. It removes the donation on each transaction, and contains bulk endpoints for TX and balances
- electron-bch-coinjoin-wallet will be the desktop UI for the wallet.
- coinjoin-cli is an oclif CLI that can perform all the same functionality as the desktop UI, and has tools for debugging the p2p network.

Got ipfs-service-provider forked to colab-coinjoin-api.

Next step is to port the `manageAnnouncement()` function from the timer-controller library in ipfs-coord over to colab-coinjoin-api. This will allow it to announce itself on the coinjoin pubsub channel. That will let peers find one another.


### 1/11
- started at 7AM. Stopped at 8:30AM. = 1.5 hr

Added a README to the BCH CoinJoin GitHub group.

Started reviewing the code in slp-cli-wallet to figure out how to pull out what I need and merge it with minimal-slp-wallet.

Notes on UTXO management:
- Spending a UTXO should use a UTXO that is equal to or larger than the amount to be spent.
  - If a large enough UTXO can not be found, the biggest UTXOs should be combined.
- the `nextAddress` property marks the current location in the HD index.
- The bulk of UTXOs should live in from nextAddress-100 to nextAddress-1
  - A `addrBalances` array should hold the specific indexes, addresses, and balances for the wallet.
  - An update-balance command will just check the last 100 addresses. It consideres `addrBalances`, but does not update it.
  - A `scan-keychain` command should run from index 0 to `nextAddress` and update the `addrBalances` array.

I'll get everything working for BCH, then I'll figure out how to add tokens. That will be an optional feature.

I need bulk endpoints for:
- TX history for 20 addresses at a time.
- Balances for 20 addresses at a time.


I should probably fork minimal-slp-wallet and create hd-slp-wallet to contain the code for working with HD wallets that have SLP tokens.

The wallet file will have a `comIndex` property. That is the index in the HD tree that is used for e2e encrypted communication. It will change after each CoinJoin round.

The wallet should be controlled by a REST API. That way I can build a command-line app that mirrors the Web UI in Electron, and exercise all the same functions from the command line.

ToDo:
- Add flag (if it doesn't already exist) to disable the balances caching in fulcrum-rest-api
- Fork minimal-slp-wallet into hd-slp-wallet
- Add bulk TX history endpoints to CashStack and integrate into hd-slp-wallet
- fork ipfs-service-provider into coinjoin-wallet-api
- Fork the latest oclif boilerplate to create coinjoin-cli

### 1/9
- started at 2:30PM. Stopped at 4PM. = 1.5 hr

I tried to install the binary and I got errors. Looking into that.

I fixed the issues, rebuilt, and tested v1.1.4 on both a Linux and Windows machine. Both worked. I'll test a Mac later tonight.

### 1/7
- started at 3PM. Stopped at 4PM. = 1 hr
- started at 5:30PM. Stopped at 8PM. = 2.5 hr

Two issues I need to resolve next with the Electron.js app:
- I need to create a pipeline for publishing Mac, Linux, and Windows binaries.
- The current system for switching back end servers with putting a query parameter in the URL won't work with Electron.js

So far I've got Electron.js to create a deb and rpm binary for Linux. But I need binaries for Windows and Mac, and prefferably an AppImage for Linux.

There are a lot of ways to package Electron.js apps. Spent time exploring a few different options.

This GitHub actions plugin seems like the best way to easily compile for cross-platform desktop apps:
https://github.com/marketplace/actions/electron-builder-action

The GitHub actions were the way to go. I got the cross-compiled binaries attached to the releases from the CI/CD.
https://github.com/bch-coinjoin/electron-bch-wallet-single-addr/releases/tag/untagged-de14d13688618a8cf6b7

### 1/6
- started at 5:45AM. Stopped at 9AM. = 3.25 hr
- started at 9:45AM. Stopped at 10:15AM. = 0.5 hr

Running through the Learna tutorial for learning how to set up a monorepo.
- Running through the tutorial resulted in an error without any debugging info. This looks like a trap: a tool that is supposed to make this development easier, but in fact is adding complexity and will be a time suck.

Switched gears. Created a bch-coinjoin GitHub group. Forked the bch-wallet-web3-android repository. Will remove the android stuff and add in the Electron code to turn it into a desktop app.

I was able to get the React app running inside Electron in dev mode. It's a two step process: `npm start` to start React. Then `npm run electron` in a second terminal to open the react app in Electron.




### 1/5/23
- started at 9:30AM. Stopped at 10:45AM. = 1.25 hr

Looking into Capacitor.js before I commit to Electron.js.
- I looked into this at a suggestion from Stoyan.
- Capacitor does not have a native desktop solution. It simply integrates with Electron.js.

Looking into Learna before I start a new repo for the Electron.js app. This project is going to have a lot of moving parts, and it may be better to put everything into a monorepo.


### 1/2/23

- started at 6PM. Stopped at 8:30PM = 2.5 hr

Updated the gist to reflect current status:
https://gist.github.com/christroutner/da18dabfcb3daf75e8d11d400753f29a

First order of business is to learn Electron.js.
https://www.electronjs.org/

Great tutorial and quick start guides:
https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites

IPFS desktop is an electron app running go-ipfs inside it:
https://github.com/ipfs/ipfs-desktop

I rediscovered this video and code repositories for Consolidating CoinJoin:
https://youtu.be/LqqRR4Kfr-M
https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet
- Ignore this. This was an ignorant attempt at CoinJoin.
