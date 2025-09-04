---
tags: [oidc]
---

[OpenID Connect Core 1.0 incorporating errata set 2 - Self-Issued OpenID Provider](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssued)

# Self-issued OpenID Provider (SIOP)

A Self-Issued OpenID Provider (SIOP) is a personal, self-hosted OpenID Provider that allows a user to become the issuer of their own identity information. Instead of relying on a third-party server, the user's keys are used to sign their own ID Tokens and present self-attested claims directly to a Relying Party. This changes the trust model, as the Relying Party's trust is directly with the end-user rather than an institutional identity provider. This framework enables decentralized identity concepts by allowing users to control their own verifiable credentials.

:::note Draft Status
SIOP is part of the [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssued).
While anticipating future interest and need for distributed identities, the standard is overall very light on background, context, and usage.

OpenID has has been working on a [Self-Issued OpenID Provider v2](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html) specification which is currently an implementers draft from 2023.
:::

## Difference between traditional OP and SIOP

The main difference between a traditional OpenId Provider and a Self-Issued OpenId Provider is that the Self-Issued OpenID Provider allows the end-user to choose which identifiers and claims should be released to the application (Relying Party).

## When to use SIOP?

Self-Issued OpenID Provider (SIOP) can be useful, when organizations want to enable decentralized identity and give users more control over their personal data, for example in situations where:

* Strengthen user privacy, be enabling users to present claims directly to a relying party without the original issuer of the claim knowing where the information is being used.
* Enabling authentication in environments with limited or no internet connectivity.
* Reliability is critical, providing an alternative to a central, hosted identity provider, reducing reliance on a single third-party service that could become unavailable.
* Aggregation of verifiable credentials from various issuers into a single transaction.

## References

* [Self-Issued OpenID Provider v2 - draft 13](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html) <span> Implementer's Draft</span>
* [Where to begin with OIDC and SIOP](https://medium.com/decentralized-identity/where-to-begin-with-oidc-and-siop-7dd186c89796)