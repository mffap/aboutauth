
# OpenID Connect (OIDC)

OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 protocol. Simply put, it's a modern way for your application to verify the identity of a user and, optionally, obtain basic profile information about them. Think of it as the digital equivalent of a passport.

The beauty of OIDC lies in its simplicity and flexibility. It allows your users to authenticate with a trusted provider (e.g., Google, Facebook, or your company's identity provider), and then use that authentication to access your app without having to create a new account or remember a separate password. This enhances user experience and security.

OIDC is not just for web apps. It works seamlessly with mobile apps, single-page apps, and even server-side apps. It's a versatile tool in your identity management arsenal.

## OpenID Connect Resources

* [OIDC Primer](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1) (okta.com)

## OpenID Connect Related

* [Identity Provider](identity-provider)
* Scopes
* Claims
* Response Types

Tokens

* [Access Tokens](./access-token)
* [ID Tokens](id-token)
* Refresh Tokens

Verifying tokens

* Introspection
* JWK vertification

Flow Types

* Authorization Code Flow
* Implicit Flow
* Hybrid Flow
* Device Authorization Flow
* Client Credentials
* Resource Owner Password

## Industry Standard

### OpenID Connect Protocol Suite

Minimal

* [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) (openid.net)

Dynamic

* [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) (openid.net)
* [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html) (openid.net)

Complete

* [OpenID Connect Session Management 1.0](https://openid.net/specs/openid-connect-session-1_0.html) (openid.net)
* [OAuth 2.0 Form Post Response Mode](https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html) (openid.net)

### Protocols underpinning OpenID Connect

* [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
* [Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
* [Assertion Framework for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7521)
* [JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7523)
* [OAuth 2.0 Multiple Response Type Encoding Practices](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html)
* [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
* [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
* [JSON Web Key (JWK)](https://datatracker.ietf.org/doc/html/rfc7517)
* [JSON Web Algorithms (JWA)](https://datatracker.ietf.org/doc/html/rfc7518)
* [WebFinger](https://datatracker.ietf.org/doc/html/rfc7033)