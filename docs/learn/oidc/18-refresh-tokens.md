---
tags: [oidc, standard, refresh-token]
---

# Refresh Tokens in OpenID Connect

[OpenID Connect Core 1.0 - Using Refresh Tokens](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens)

A Refresh Token is a credential defined by the [OAuth 2.0 authorization framework (RFC 6749)](https://www.rfc-editor.org/rfc/rfc6749.html#section-1.5) that a client uses to obtain new Access Tokens when the current ones expire, or to obtain additional access tokens, without user re-authentication.

OIDC reuses the OAuth 2.0 Refresh Token Grant flow: a client sends the refresh token with `grant_type=refresh_token` to the [Token Endpoint](./openid-connect-endpoints-and-requests.mdx#token-endpoint) to receive a new access token.

:::info
**OAuth 2.0** is an **authorization** protocol, focusing on granting delegated access to resources.
**OpenID Connect (OIDC)** is an identity layer built on top of OAuth 2.0 to provide **authentication** and identity information (claims) about an End-User.
OpenID Connect re-uses concepts specified by the OAuth 2.0 protocol and related standards.
:::

## ID Token as part of the Refresh Token Grant

The key addition in OIDC regarding refresh tokens is that the successful response from the Token Endpoint **MUST** also include a new **ID Token** if the `openid` scope was granted when the refresh token was issued.
This new ID Token provides up-to-date claims about the authentication event.

OIDC also defines the [offline_access scope](./17-offline-access.md) which a client must request during the initial authorization to signal its intent to use the refresh token for accessing resources when the user is not actively present.
