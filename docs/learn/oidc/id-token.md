---
sidebar_position: 2
tags: [oidc, jwt, authentication]
---

# ID Token

[OpenID Connect Core 1.0 incorporating errata set 2 - ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)

An ID Token in OpenID Connect is a digital security document, specifically a [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519), that acts as proof a user has been authenticated by an OpenID Provider (OP).
It contains claims (information) about the user and the authentication event.

OpenID Connect introduces the ID Token as an extension to OAuth 2.0 that allows users to be authenticated. The ID Token contains information in form of Claims about the authentication.

ID Tokens are signed using [JWS](https://datatracker.ietf.org/doc/html/rfc7515) and optionally the signed token is encrypted using JWS and [JWE](https://datatracker.ietf.org/doc/html/rfc7516) to provide integrity, authenticity, and confidentiality.

## Example of an ID Token

```json title="ID Token"
{
  "iss": "https://server.example.com", // Issuer that created and signed this token
  "sub": "24400320", // Subject for the End-User whom the token refers to
  // Audiences who the ID Token is intended for as
  // one or multiple OAuth 2.0 client_id
  "aud": [
    "170084138865393921",
    "170084137741451521"
  ],
  "exp": 1311281970, // Expiration time (Unix Timestamp)
  "iat": 1311280970, // Issued at (Unix Timestamp)
  "auth_time": 1311280969, // Time when end-user authentication occurred (Unix Timestamp)
  "nonce": "n-0S6_WzA2Mj", // Associates Client session to token
  // Identifies the Authentication Context Class or Level of Assurance that
  // the authentication performed satisfies
  "acr": "urn:mace:incommon:iap:silver",
  // Authentication Methods References array
  "amr": [
    "user", // User presence test
    "mfa" // Multiple-factor authentication
  ],
  // Authorized party as OAuth 2.0 client_id to which the ID Token was issued
  "azp": "170084138898948353",
  "at_hash": "", //Authorized Party
  "c_hash": "", // Code hash value mitigating token substitution (Hybrid Flow)
}
```

## ID Token vs. Access Token

While both are tokens, they serve distinct purposes in the OAuth 2.0 and OIDC ecosystem.

| Feature        | ID Token                                       | Access Token                                 |
| :------------- | :--------------------------------------------- | :------------------------------------------- |
| **Purpose**    | Authentication (Who is the user?)              | Authorization (What can the user do?)        |
| **Audience**   | Client Application                             | Resource Server (API)                        |
| **Format**     | Always a JWT                                   | Can be any format (often opaque)             |
| **Content**    | User identity claims (`sub`, `name`, `email`)  | Permissions, scopes, user ID                 |
| **Client Use** | Validate signature, read claims for user info. | Treat as opaque, send to API in `Authorization` header. |

## How to use ID Tokens

**ID Tokens are a proof of authentication for the Client, while Access Tokens are for accessing a Resource Server (eg, API)**.
The client application is the intended audience of an ID Token to get more information about who authenticated.
During an OIDC flow, the client also receives an Access Token and uses the Access Token to make requests to a protected resource server (API).
The client should not attempt to inspect the Access Token.
**Don't send ID Tokens to an API**. APIs should be protected using Access Tokens. Sending an ID Token to an API as a bearer token is a common mistake. The API should require an Access Token and validate its scope and permissions.
**The ID Token can also serve as protection against denial of service attacks during logout**.
The client should send the ID Token in the`id_token_hint` to the `end_session_endpoint` when [initiating a logout](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout).


## Resources

* [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
* [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
* https://stackoverflow.com/questions/52632690/can-someone-explain-acr-return-values-in-oidc
* [Level of Assurance (LoA) Profiles](https://www.iana.org/assignments/loa-profiles/loa-profiles.xhtml)
* [An IANA Registry for Level of Assurance (LoA) Profiles [RFC6711]](https://www.rfc-editor.org/rfc/rfc6711.txt)
* [Identity Assurance Qualifiers (was LOA)--A Recommended URI Profile for InCommon](https://spaces.at.internet2.edu/display/macedir/Identity+Assurance+Qualifiers+%28was+LOA%29--A+Recommended+URI+Profile+for+InCommon)
* [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html)
