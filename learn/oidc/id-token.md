---
# sidebar_position:
tags: [oidc, jwt]
---

# ID Token

https://openid.net/specs/openid-connect-core-1_0.html#IDToken

An ID Token in OpenID Connect is a digital security document, specifically a [JSON Web Token (JWT)](../jwt/), that acts as proof a user has been authenticated by an OpenID Provider (OP).
It contains claims (information) about the user and the authentication event.

ID Tokens are signed using [JWS](../jose/json-web-signature-jws.md) and optionally the signed token is encrypted using [JWS](../jose/json-web-signature-jws.md) and [JWE](../jose/json-web-encryption-jwe.md) to provide integrity, authenticity, and confidentiality.

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

## Related

* [Level of Assurance](../authentication/level-of-assurance)
* [Authentication Method Reference Values](../jwt/authentication-method-reference)
* [JSON Web Token (JWT)](../jwt/)

## Resources

* https://stackoverflow.com/questions/52632690/can-someone-explain-acr-return-values-in-oidc
