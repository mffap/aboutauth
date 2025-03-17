# Authorization Code Flow with Proof Key for Code Exchange (PKCE)

OpenID Connect performs authentication to log in the End-User or to determine that the End-User is already logged in. 
OpenID Connect returns the result of the Authentication performed by the Server to the Client in a secure manner so that the Client can rely on it.
Authentication can follow multiple paths such as

* Authorization Code Flow
* Implicit Flow ([not recommended](https://datatracker.ietf.org/doc/html/rfc9700#name-implicit-grant))
* Hybrid Flow
* Authorization Code Flow with Proof Key for Code Exchange (PKCE)

[Proof Key for Code Exchange (RFC 7636)](https://www.rfc-editor.org/rfc/rfc7636) is an extension to the Authorization Code Flow to prevent CSRF and authorization code injection attacks.

While the original draft for PKCE was intended to protect public clients, such as mobile applications, the [Best Current Practice for OAuth 2.0 Security](https://datatracker.ietf.org/doc/html/rfc9700#name-authorization-code-grant) recommends Authorization Code Flow with Proof Key for Code Exchange (PKCE) even with confidential client applications.

This means in practice you should always use the Authorization Code Flow with PKCE.
