---
# sidebar_position:
tags: [oidc, jwt]
---

# ID Token

[openid.net/specs/openid-connect-core-1_0.html#IDToken](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)

An ID Token in OpenID Connect is a digital security document, specifically a [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519), that acts as proof a user has been authenticated by an OpenID Provider (OP).
It contains claims (information) about the user and the authentication event.

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

## Resources

* [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
* [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
* https://stackoverflow.com/questions/52632690/can-someone-explain-acr-return-values-in-oidc
* [Level of Assurance (LoA) Profiles](https://www.iana.org/assignments/loa-profiles/loa-profiles.xhtml)
* [An IANA Registry for Level of Assurance (LoA) Profiles [RFC6711]](https://www.rfc-editor.org/rfc/rfc6711.txt)
* [Identity Assurance Qualifiers (was LOA)--A Recommended URI Profile for InCommon](https://spaces.at.internet2.edu/display/macedir/Identity+Assurance+Qualifiers+%28was+LOA%29--A+Recommended+URI+Profile+for+InCommon)
