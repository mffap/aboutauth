import Link from "@docusaurus/Link";
import SoftwareProviders from "./software";
import styles from './styles.module.css';

import React from "react";

export default function SoftwareTable() {

  const opt = { open_source_only: false };
  const providers = SoftwareProviders(opt);

  return (
    < >
      {
        providers
          .sort((a,b) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            else return 0
          })
          .map((provider, idx) => (
            <SoftwareProvider key={idx} provider={provider} />
          ))
      }
    </ >
  );
}

function SoftwareProvider({ provider }) {
  return (
    <section className={styles.providerSection}>
      <h4>{provider.title}</h4>
      <div>{provider.description}</div>
      <div>
        <Link href={provider.link}>{provider.title}</Link>
      </div>
    </section>
  );
}