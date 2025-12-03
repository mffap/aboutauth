---
sidebar_label: Client Authentication
tags: [oidc]
---

# How to Authenticate Clients in OpenID Connect

When an application (the Client) interacts with an [OpenID Provider's Endpoints](openid-connect-endpoints-and-requests.mdx) it must prove its identity by authenticating with the OP.
While OAuth 2.0 provides the baseline for this process, OpenID Connect (OIDC) extends it with more robust, cryptography-based ("assertion-based") mechanisms.

Assertion-based authentication (`client_secret_jwt` and `private_key_jwt`) shift the paradigm from "sending a password" to "proving possession of a key".
This prevents replay attacks (thanks to `jti` and `exp` claims) and credential theft on the wire.

:::note Non-Human Identities
A client can be an application but also a service user (non-human identity).
Non-human identities can use the same, non-interactive authentication methods as outlined in this document.
:::

## Summary of Client Authentication Methods

The following table compares the client authentication mechanisms defined in OAuth 2.0 and OpenID Connect.

| Method | Mechanism | Security Profile | Use Case |
| :---| :--- | :--- | :--- |
| `client_secret_basic`  | **Header:** `Authorization: Basic Base64(id:secret)` | **Baseline** Credentials are sent on the wire. Vulnerable if TLS is compromised or terminated early. | Simple server-side apps where high security is not the primary blocker. |
| `client_secret_post` | **Body:** `client_id` & `client_secret` parameters | **Low** Credentials are sent on the wire and are highly prone to leaking in server access logs. | **Not Recommended** unless headers are technically impossible to implement. |
| `client_secret_jwt` | **Assertion:** JWT signed with Shared Secret (HMAC) | **High** The secret is used as a cryptographic key and never crosses the network. | Scenarios where key management infrastructure (PKI) is too complex, but wire security is required. |
| `private_key_jwt` |  **Assertion:** JWT signed with Private Key (RSA/ECDSA) | **Highest** Offers non-repudiation. No shared secret exists to be stolen from the authorization server. | Financial-grade APIs (FAPI), Banking, and high-security enterprise integrations. |

## Client Secret Authentication Methods (OAuth 2.0)

The fundamental methods rely on a shared client_secret and are defined in OAuth 2.0 [RFC 6749, Section 2.3: Client Authentication](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1).

### Client Secret Basic `client_secret_basic`

[RFC 6749 Section 2.3.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1)

The client transmits its `client_id` and `client_secret` using [HTTP Basic Authentication](https://datatracker.ietf.org/doc/html/rfc7617): `Authorization: Basic Base64(client_id:client_secret)`

```http title="Example Token Request with client_secret_basic"
POST /token HTTP/1.1
Host: idp.aboutauth.com
//highlight-start
Authorization: Basic czZCaGR...kY3Q=  // Base64(client_id:client_secret)
//highlight-end
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=Splxl...g
```

### Client Secret Post `client_secret_post`

[RFC 6749 2.3.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1)

The client transmits its `client_id` and `client_secret` directly in the HTTP request body.

:::warning Not recommended
It is not recommended to use `client_secret_post` unless headers are technically impossible to implement.
Credentials are sent on the wire and are highly prone to leaking in server access logs.
:::

```http title="Example Token Request with client_secret_post"
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
    &code=Splxl...g
    //highlight-start
    &client_id=s6Bhd...t&
    client_secret=gflk...8G
    //highlight-end
```

## Assertion-Based Methods (OIDC)

OIDC introduced methods leveraging **Assertions** (specifically, **JSON Web Tokens - JWTs**) to prove identity without relying on a simple, long-lived shared secret transmitted in plain form.

### Assertion Mechanics: Signed JWT Claims

For assertion-based client authentication methods, the client generates a [signed JWT](17-signature-and-encryption-key-rotation-jws-jwe.md) that contains specific claims, as detailed in [RFC 7523](https://www.rfc-editor.org/rfc/rfc7523.html).
This signed JWT acts as the Assertion.

| Claim | Value | Purpose |
| :--- | :--- | :--- |
| **`iss`** (Issuer) | The `client_id` | Identifies the signer. |
| **`sub`** (Subject) | The `client_id` | Identifies the entity being authenticated. |
| **`aud`** (Audience) | The OpenID Provider's identifier or url | Ensures the JWT is for the correct server. |
| **`exp`** (Expiration) | Short-lived timestamp | Prevents replay attacks. |
| **`jti`** (JWT ID) | Unique value per request | Ensures single-use. |

:::note Assertions
In the context of OIDC and OAuth 2.0, an Assertion is a statement made by an entity (the Issuer) about a Subject.
It's used as a mechanism for federated identity and authorization.

In the context of OAuth2.0 and OpenID Connect, the assertion is a JWT that a client signs to prove it is the owner of a registered identifier (`client_id`).

This concept is formalized in [RFC 7521: Assertion Framework for OAuth 2.0 Client Authentication and Authorization Grants](https://www.rfc-editor.org/rfc/rfc7521.html), which provides the general framework for using assertions like SAML or JWTs in OAuth. [RFC 7523](https://www.rfc-editor.org/rfc/rfc7523.html)** then specifies the exact requirements for using JWTs as those assertions, which OIDC adopts for its most secure client authentication methods.
:::

### JWT Signed with Shared Secret `client_secret_jwt`

[RFC 7523](https://www.rfc-editor.org/rfc/rfc7523.html)  
[OIDC-Core](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)

The client uses its registered `client_secret` to create an [HMAC signature](17-signature-and-encryption-key-rotation-jws-jwe.md#signing-algorithms) on the JWT Assertion.
This proves possession of the shared secret without sending the secret itself.

The client_secret_jwt method relies on Symmetric Cryptography.
Both the Client and the Authorization Server share the same secret key.
The Client [signs the JWT](17-signature-and-encryption-key-rotation-jws-jwe.md), and the Server attempts to regenerate that signature to verify it.

Requirements:

1. A JWT signed using the `client_secret` as key (HS256 recommended)
2. The **`client_assertion_type`** parameter set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.
3. The signed JWT in the `client_assertion` parameter.

```http title="Example Token Request with client_secret_jwt"
POST /token HTTP/1.1
Host: idp.aboutauth.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
    &code=Splxl...g
    //highlight-start
    &client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
    &client_assertion=eyJraWQiOiJ...k9Q  // Signed JWT using client_secret
    //highlight-end
```

### JWT Signed with Private Key `private_key_jwt`

[RFC 7523](https://www.rfc-editor.org/rfc/rfc7523.html)  
[OIDC-Core](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)

The client uses its registered private key to create an [RSA or ECDSA signature](17-signature-and-encryption-key-rotation-jws-jwe.md#signing-algorithms) on the JWT Assertion. This is generally the most secure option.

Requirements:

1. A [signed JWT](17-signature-and-encryption-key-rotation-jws-jwe.md) using the client's private key (e.g., RS256).
2. The `client_assertion_type` parameter set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.
3. The signed JWT in the `client_assertion` parameter.

```http title="Example Token Request with private_key_jwt"
POST /token HTTP/1.1
Host: idp.aboutauth.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
    &code=Splxl...g
    //highlight-start
    &client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
    &client_assertion=eyJraWQiOiJ...k9Q  <-- Signed JWT using private key
    //highlight-end
```
