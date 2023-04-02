import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Five Design Components',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        There are five design components to a CoinJoin wallet. This framework
        decouples them, so that developers can work on each separately
      </>
    ),
  },
  {
    title: 'Easy Wallet Integration',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        The Collaborative CoinJoin framework is designed to be easy to integrate
        into any wallet.
      </>
    ),
  },
  {
    title: 'Powered by Cash Stack',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Collaborative CoinJoin is based on the <a href="https://cashstack.info"
        target="_blank">Cash Stack</a>. It uses a combination of blockchain
        and IPFS technology to function with no single point of failure.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
