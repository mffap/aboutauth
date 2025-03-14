import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    title: 'Learn about Auth',
    link: '/docs/learn',
    Svg: require('@site/static/img/noun-learning.svg').default,
    description: (
      <>
        Learn more about Auth, how it works, and how to use it.
      </>
    ),
  },
  {
    title: 'Resources about Auth',
    link: '/resources',
    Svg: require('@site/static/img/noun-resources.svg').default,
    description: (
      <>
        Discover resources to help you understand Auth and how to use it.
      </>
    ),
  },
  {
    title: 'Tools for Auth',
    link: '/top-identity-and-access-management-software',
    Svg: require('@site/static/img/noun-tools.svg').default,
    description: (
      <>
        Explore tools that can help you with Auth.
      </>
    ),
  },
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Link to={link}>
          <Svg className={styles.featureSvg} role="img" />
        </Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
