---
slug: flipstarter-summary
title: Flipstarter Summary
authors: [trout]
tags: [flipstarter]
---

![coinjoin logo](./coinjoin-logo.jpeg)

The [Collaborative CoinJoin project](https://github.com/bch-coinjoin) was generously funded by members of the Bitcoin Cash community who were unsatisfied with the current privacy options and wanted to see innovation in that space. The project has now exhausted the funds from the initial funding round, and the results have been well received by the community. This blog post is a recap of the challenges and successes of the project.

## Challenges

### Political Challenges

The political climate and its chilling effect on Bitcoin privacy technology continued to get worse during the development of this project. Shortly before this project was proposed, in August of 2022, Tornado Cash was blacklisted by the US government, and [the main developer was arrested](https://techcrunch.com/2022/08/12/suspected-tornado-cash-developer-arrested-in-amsterdam/). In March of 2023, while wrapping up this first round of development, it was announced that the [ChipMixer creator could face 40 years in prison](https://news.bitcoin.com/international-operation-takes-down-crypto-mixer-chipmixer-creator-could-face-40-years-in-prison/).

These events have made it clearer than ever that Bitcoin Cash users who value privacy must be able to operate the software on their own computers, with no central point of failure. There is a constant parade of headlines of arrests for anyone who tries to provide privacy-as-a-service, underscoring the need for the approach the Collaborative CoinJoin project has taken.

## Volatility Challenges

From the time the Flipstarter campaign was proposed, to the time it was funded, the price of BCH increased by 16%, then fell to -16%, then came back. This volatility always makes it hard to budget for a crypto project.

The original scope of the Flipstarter was to fund $12,000, which would pay for 120 hours of work over the course of 12 weeks. Well over 120 hours of work was put into this project. While the original goal of creating a fully-functional desktop application was not achieved, the project is not far away from this goal. A desktop application exists, and a functional CoinJoin protocol exists. All that remains is to improve both parts, and then marry them together.

## Development Challenges

When the Consolidating CoinJoin project was first proposed, [Electron.js](https://www.electronjs.org/) was chosen as the obvious tool for building a desktop application. This software framework is used by big names like Slack, Discord, Skype, Postman, and many more. There is no other JavaScript framework for building desktop applications that are comparable. Everything else is a distance second.

As it turned out, Electron was extremely sensitive to the code needed to generate cryptocurrency transactions. They use a different encryption library than node.js, requiring some slight adjustments deep inside the [bch-js](https://github.com/Permissionless-Software-Foundation/bch-js) code repository. After finding and overcoming that hurdle, it turned out that Electron is only compatible with JavaScript libraries written in CommonJS format, lagging behind the newer use of ESM formatted libraries. This required significant reformatting of several libraries, and required the use of older libraries that did not have newer features. There were other issues, this is just a quick summary. Suffice to say, these unexpected difficulties chipped away at the available developer funds.


## Successes

The main success of this project is that the Consolidating CoinJoin protocol exists! Any JavaScript developer can [set up a development environment](/docs/intro) and begin integrating it into their wallet. We've also got all the infrastructure in place to allow community developers to [contribute](/docs/contributing) to growing the functionality of the project.

While funding ran out before the user interface (UI) for the desktop wallet could be customized, the [Electron repository for the project](https://github.com/bch-coinjoin/electron-bch-coinjoin-wallet) successfully builds with all the project components (HD wallet and API server). That in itself is a major achievement, as integrating all the components into an Electron app was not an easy feat of engineering. It is anticipated that building out a functional UI will take less time than it took to get the Electron repository to its current state.

## Project Future

What does the future hold? More development!

But the pace and direction of that development will depend on the Bitcoin Cash community. The project will be maintained by the [Permissionless Software Foundation](https://psfoundation.info), and [contributions](/docs/contributing) by BCH developers will be encouraged and celebrated.

A second Flipstarter campaign is currently being planned out. [Chris Troutner](https://github.com/christroutner) is soliciting input from the BCH developers and Flipstarter contributors about the features that are most desired and that people are most willing to fund.

The funding for the next campaign will be in the range of $10,000 USD, so slightly less than the first funding round. It's anticipated that this project will regularly appeal to the BCH community to fund continued development. Now that the skeleton of the project is firmly in place, development can be handed off to less expensive developers, and Chris can focus more on code-reviews and management. This means future campaigns should see much more bang for their buck, and the pace of development and new features should accelerate.
