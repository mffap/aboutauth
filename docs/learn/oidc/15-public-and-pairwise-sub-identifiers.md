---
sidebar_label: "Subject Identifier Types"
tags: [oidc, sub, identifier]
---

# OpenID Connect Public and Pairwise Subject Identifier Types

In OpenID Connect, the `sub` (subject) claim in the [ID Token](2-id-token.md) acts as the unique identifier for the End-User. 
Unlike the `email` claim, which can change, the `sub` is intended to be stable and locally unique.

The [OpenID Connect Core 1.0 specification](https://www.google.com/search?q=https://openid.net/specs/openid-connect-core-1_0.html%23SubjectIDTypes) defines public and pairwise standard methods for generating these identifiers.

## Public Subject Identifiers

The OpenID Provider (OP) issues the same `sub` value for a specific user to all Clients.

This allows distinct Clients (e.g., a CRM and a Support Portal) to correlate the user's activity and merge records.

```json title="ID Token for Client A"
{
  "sub": "user-12345", // Same value
  "aud": "client-a.apps.aboutauth.com",
  "iss": "https://idp.aboutauth.com",
  ...
}
```

```json title="ID Token for Client B"
{
  "sub": "user-12345", // Same value
  "aud": "client-b.apps.aboutauth.com",
  "iss": "https://idp.aboutauth.com",
  ...
}
```

## Pairwise Subject Identifiers

To enhance privacy, an OP can use Pairwise Subject Identifiers.
In this mode, the OP issues a different `sub` value to each Client for the same user.
Client A cannot correlate its user data with Client B simply by comparing `sub` values.

The issuer creates a globally unique identifier and stores this value, or uses an algorithm to calculate these identifiers deterministically.

```json title="ID Token for Client A"
{
  "sub": "17d7d88ade3928f15c72b88867a988d09b09b983dde78031687f8a10f3cc56ab", // Unique to Client A
  "aud": "client-a",
  "iss": "https://idp.aboutauth.com",
  ...
}
```

```json title="ID Token for Client B"
// ID Token for Client B
{
  "sub": "94cac262cfda55a39c61d7500d4a29fa43965bc5ba45a8f974df4bae759a9841", // Unique to Client B
  "aud": "client-b",
  "iss": "https://idp.aboutauth.com",
  ...
}
```

## Calculating Pairwise Identifiers

The specification outlines a method for calculating these identifiers deterministically so the OP doesn't need to store every user-client pair.

The algorithm typically involves a

* Sector Identifier: Usually the host component of the Client's `redirect_uri` or a specifically registered `sector_identifier_uri`. This ensures that related apps (e.g., `aboutauth.com` and `portal.aboutauth.com`) can share the same pairwise ID if desired.
* Local account ID: An identifier for the user account within the Client (eg, `user-12345`)
* Secret salt: A secret value known only to the OP to prevent offline reversal.

Common implementations concatenate the individual values to form an irreversible hash like:  
`sub = SHA-256( Sector_Identifier + Local_Account_ID + Salt )`

:::note
Above example was calculated as  
`sub = SHA-256("portal.aboutauth.com" + "user-12345" + "supersecretsaltvalue")` 
and  
`sub = SHA-256("aboutauth.com" + "user-12345" + "supersecretsaltvalue")`
:::

## Discovery and Registration

Clients can discover supported types via the `subject_types_supported` element in the OP's [Discovery Document](https://www.google.com/search?q=https://openid.net/specs/openid-connect-discovery-1_0.html%23ProviderMetadata).

Clients specify their preference during dynamic registration using the `subject_type` parameter. If requesting `pairwise`, they may also need to provide the `sector_identifier_uri` containing a JSON array of all valid `redirect_uris` for the group.

When Client A (`client-a`) and Client B (`client-b`) both register the same `sector_identifier_uri` pointing to `https://portal.aboutauth.com/`, the OP uses `portal.aboutauth.com` as the sector for both. Consequently, the algorithm yields the same `sub` value for both clients.
