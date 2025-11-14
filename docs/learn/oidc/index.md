
# OpenID Connect (OIDC)

[openid.net/specs/openid-connect-core-1_0.html](https://openid.net/specs/openid-connect-core-1_0.html)

OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 protocol. Simply put, it's a modern way for your application to verify the identity of a user and, optionally, obtain basic profile information about them. Think of it as the digital equivalent of a passport.

The beauty of OIDC lies in its simplicity and flexibility. It allows your users to authenticate with a trusted provider (e.g., Google, Facebook, or your company's identity provider), and then use that authentication to access your app without having to create a new account or remember a separate password. This enhances user experience and security.

OIDC is not just for web apps. It works seamlessly with mobile apps, single-page apps, and even server-side apps. It's a versatile tool in your identity management arsenal.

## OpenID Connect Related

* [OpenID Connect for Developers](what-is-openid-connect.mdx)
* [ID Token](./id-token)
* [Authentication Request](./authentication-request)
* [Token Request](2-id-token.md)
* [Authorization Code Flow](./authorization-code-flow-with-proof-key-for-code-exchange-pkce/)
* Implicit Flow
* Hybrid Flow
* [Initiating Login from a Third Party](./initiating-login-from-a-third-party-sso)
* [Scopes in OpenID Connect](9-standard-openid-connect-scopes.md)
* [Standard Claims](./standard-claims)
* [UserInfo Request](11-userinfo-request.md)
* [Aggregated and Distributed Claims](12-aggregated-and-distributed-claims.md)
* [Passing Request Parameters as JWT](13-passing-request-parameters-as-jwt)
* [Self-Issued OpenID Provider](13-self-issued-openid-provider.md)
* Subject Identifier Types
* Client Authentication
* Signature and Encryption
* [Offline Access](17-offline-access.md)
* [Refresh Token](./18-refresh-tokens.md)
* [Endpoints and requests](./openid-connect-endpoints-and-requests.mdx)

## OpenID Connect Standard Protocol Suite

### OIDC Minimal

**[OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)**

The foundational specification. It defines the main OIDC functionalities, including [authentication flows](authorization-code-flow-with-proof-key-for-code-exchange-pkce.md), the [ID Token](2-id-token.md), and the UserInfo endpoint, all built on top of OAuth 2.0.

### OIDC Dynamic

**[OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)**

Enables clients to dynamically discover the configuration of an OpenID Provider, such as its endpoints and capabilities, by fetching a JSON document from a well-known URL. This simplifies client setup.

**[OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html)**

Allows client applications to register with an OpenID Provider on-the-fly, rather than requiring manual pre-configuration. The client receives a `client_id` and other necessary metadata to interact with the provider.

### OIDC Complete

**[OpenID Connect Session Management 1.0](https://openid.net/specs/openid-connect-session-1_0.html)**

Defines how to manage the end-user's session at the OpenID Provider, including mechanisms for single sign-out (logging out from both the application and the provider).

**[OAuth 2.0 Form Post Response Mode](https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html)**

Specifies a secure method for the Authorization Server to return parameters (like authorization codes or tokens) to the client by sending them in the body of an HTTP POST request, avoiding exposure in browser history or server logs.

### Other OpenId Connect Specifications

* [OAuth 2.0 Multiple Response Type Encoding Practices](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html)
* [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html)
* [OpenID Connect Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html)
* <span> Implementer's Draft</span> [Self-Issued OpenID Provider v2 - draft 13](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html)

## Protocols underpinning OpenID Connect

* [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
* [Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
* [OAuth 2.0 Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662)
* [OAuth 2.0 Token Revocation](https://datatracker.ietf.org/doc/html/rfc7009)
* [Assertion Framework for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7521)
* [JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7523)
* [OAuth 2.0 Multiple Response Type Encoding Practices](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html)
* [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636)
* [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
* [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
* [JSON Web Key (JWK)](https://datatracker.ietf.org/doc/html/rfc7517)
* [JSON Web Algorithms (JWA)](https://datatracker.ietf.org/doc/html/rfc7518)
* [WebFinger](https://datatracker.ietf.org/doc/html/rfc7033)

## More learning resources about OpenID Connect

* [OIDC Primer](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1)

:::info
More resource about auth on our [Resources](/resources) page.
:::
