import Link from "@docusaurus/Link";
import React from "react";

export default function SoftwareProviders({ open_source_only = false } = {}) {

  const providers = [
    {
      title: "Zitadel",
      link: "https://zitadel.com",
      description: "An open-source, cloud-native identity infrastructure platform that simplifies B2B and B2C use cases. It is known for its multi-tenancy capabilities and API-first approach, making it an excellent choice for developers building modern applications that require fine-grained access control and self-service for their customers.",
      usp: "Modern open source IAM, with a focus on cloud native applications, strong integration and auditing features, and easy migration from other systems like Keycloak.",
      open_source: true,
      cloud_service: true,
      self_hosted: true,
    },
    {
      title: "Auth0 (by Okta)",
      link: "https://auth0.com",
      description: "A developer-focused platform that offers a wide range of authentication and authorization features. It's known for its extensibility and SDKs, making it a popular choice for building customer-facing applications. Auth0 was acquired by Okta, but continues to be a major player in the space.",
      usp: "Highly extensible and developer-friendly IAM platform with a vast array of SDKs and integrations, ideal for customer-facing applications.",
      open_source: false,
      cloud_service: false,
      self_hosted: false,
    },
    {
        title: "AWS Cognito",
        link: "https://aws.amazon.com/cognito/",
        description: "A fully managed service from Amazon Web Services (AWS) that provides user authentication, sign-up, sign-in, and access control for web and mobile apps. It is a natural choice for applications already running on AWS due to its deep integration with the wider AWS ecosystem.",
        usp: "Scalable, serverless user identity for AWS applications. Seamless integration with AWS services.",
        open_source: false,
        cloud_service: true,
        self_hosted: false,
    },
    {
      title: "Keycloak",
      link: "https://www.keycloak.org/",
      description: "An open-source IAM solution that provides features like SSO, user federation, and social login. Keycloak is a powerful, self-hosted option for developers who need more control over their identity stack.",
      usp: "Open-source flexibility and control. Highly customizable for diverse IAM needs, with strong community support.",
      open_source: true,
      cloud_service: false,
      self_hosted: true,
    },
    {
      title: "Okta",
      link: "https://www.okta.com/",
      description: "A leading IAM provider with solutions for both workforce and customer identity. Okta is a robust, enterprise-grade platform that offers single sign-on (SSO), multi-factor authentication (MFA), and a large number of pre-built integrations.",
      usp: "Cloud-based, platform-agnostic IAM with a strong focus on ease of use and broad application integration.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "FusionAuth",
      link: "https://fusionauth.io/",
      description: "A modern, self-hosted or cloud-based customer identity and access management (CIAM) platform. It offers a rich feature set, including SSO, MFA, and powerful APIs, with a focus on flexibility and low cost for developers. FusionAuth is often a strong alternative for teams who need a self-managed solution that is simpler to operate than some open-source alternatives.",
      usp: "Developer-focused IAM with extensive customization and self-hosting options. Strong emphasis on flexible authentication workflows.",
      open_source: false,
      cloud_service: true,
      self_hosted: true,
    },
    {
      title: "Microsoft Entra ID",
      link: "https://www.microsoft.com/en-gb/security/business/identity-access/microsoft-entra-id",
      description: "Microsoft's cloud-based IAM service, formerly known as Azure AD. It's deeply integrated with the Microsoft ecosystem, including Microsoft 365 and Azure, and is a strong choice for organizations standardized on Microsoft products.",
      usp: "Comprehensive enterprise IAM, deeply integrated with the Microsoft ecosystem. Strong for organizations using Microsoft 365 and Azure.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "WorkOS",
      link: "https://workos.com/",
      description: "A platform for adding enterprise-level features to your application. It provides B2B-specific identity features like SAML SSO, SCIM user provisioning, and Directory Sync. WorkOS is designed for developers who need to sell their product to larger companies that require these complex integrations with their corporate identity providers.",
      usp: "Provides developer tools to quickly add enterprise features like SSO and SAML to SaaS applications.",
      open_source: false,
      cloud_service: true,
      self_hosted: false,
    },
    {
      title: "Ping Identity",
      link: "https://www.pingidentity.com/",
      description: "An identity security platform that offers a modular approach to IAM. It provides solutions for SSO, MFA, and API security, and is a veteran in the identity space.",
      usp: "Modular and enterprise-grade IAM with a focus on security and scalability. Strong in SSO and adaptive authentication.",
      open_source: false,
      cloud_service: true,
      self_hosted: true,
    },
    {
      title: "Curity",
      link: "https://curity.io/",
      description: "An identity server that is focused on API security and standards-compliance. It is a good choice for organizations that require a highly configurable and secure solution for complex B2B and B2C use cases.",
      usp: "Standards-compliant identity server with a strong focus on API security. Highly configurable for complex use cases.",
      open_source: false,
      cloud_service: false,
      self_hosted: true,
    },
  ]
    if (open_source_only) {
        return providers.filter(provider => provider.open_source === true);
    } else {
        return providers;
    }

}