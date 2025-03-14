import Link from "@docusaurus/Link";
import React from "react";

export default function IamSoftwareTable() {

  const processors = [
    {
      title: "Zitadel",
      link: "https://zitadel.com",
      description: "",
      usp: "Modern open source IAM, with a focus on cloud native applications, strong integration and auditing features, and easy migration from other systems like Keycloak.",
      open_source: true,
      cloud_service: true,
      self_hosted: true,
    },
    {
      title: "Keycloak",
      link: "https://www.keycloak.org/",
      description: "",
      usp: "Open-source flexibility and control. Highly customizable for diverse IAM needs, with strong community support.",
      open_source: true,
      cloud_service: false,
      self_hosted: true,
    },
    {
      title: "Okta",
      link: "https://www.okta.com/",
      description: "",
      usp: "Cloud-based, platform-agnostic IAM with a strong focus on ease of use and broad application integration.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "FusionAuth",
      link: "https://fusionauth.io/",
      description: "",
      usp: "Developer-focused IAM with extensive customization and self-hosting options. Strong emphasis on flexible authentication workflows.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "Microsoft Entra ID",
      link: "https://www.microsoft.com/en-gb/security/business/identity-access/microsoft-entra-id",
      description: "",
      usp: "Comprehensive enterprise IAM, deeply integrated with the Microsoft ecosystem. Strong for organizations using Microsoft 365 and Azure.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "AWS Cognito",
      link: "https://aws.amazon.com/cognito/",
      description: "",
      usp: "Scalable, serverless user identity for AWS applications. Seamless integration with AWS services.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "WorkOS",
      link: "https://workos.com/",
      description: "",
      usp: "Provides developer tools to quickly add enterprise features like SSO and SAML to SaaS applications.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
  ]

  return (
    <table className="text-xs">
      <tr>
        <th>Name</th>
        <th>Positioning</th>
        <th>Cloud Service</th>
        <th>Self Hosted</th>
        <th>Open Source</th>
      </tr>
      {
        processors
          .sort((a, b) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            else return 0
          })
          .map((processor, rowID) => {
          return (
            <tr>
              <td key={rowID}><Link href={processor.link}>{processor.title}</Link></td>
              <td>{processor.usp}</td>
              <td>{processor.cloud_service ? 'Yes'  : 'No'}</td>
              <td>{processor.self_hosted ? 'Yes'  : 'No'}</td>
              <td>{processor.open_source ? 'Yes'  : 'No'}</td>
            </tr>
          )
        })
      }
    </table>
  );
}