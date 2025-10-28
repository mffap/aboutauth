---
sidebar_label: Refresh Token
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

## Refresh Tokens Are Opaque Tokens

> A refresh token is a string representing the authorization granted to the client by the resource owner. The string is usually opaque to the client.[^1]

The term **opaque** means the token is a string whose internal structure is not defined by the specification, and whose content is unreadable and unusable by the Client (your application).
The Client must treat the string as a black box and can only use it for its single purpose: sending it to the designated server endpoint.
The Authorization Server is the only entity that can interpret the token's value, which typically maps to a database record on the server side holding the actual authorization data.

An opaque refresh token might be a long, random sequence of characters, such as `d92hf72yq1mK3zS7h0PjA4tG6vB8nU5k`.
The Client cannot determine its expiration or scope by inspecting it.

Refresh tokens are typically opaque because they are long-lived and security-sensitive; their status (e.g., if they have been revoked) should always be checked by the Authorization Server and not the Client itself.

## Security Considerations for Refresh Tokens

### Least Privilege

Don't use refresh tokens, when you don't need to.

### Secure Storage

Refresh Tokens must be stored securely.
For confidential clients (e.g., server-side web applications), they should be stored in a secure, non-accessible database.
For public clients (e.g., mobile applications), storage should use secure storage mechanisms outside of the of the process or in case of browser-based applications not accessible by client-side JavaScript. For mobile applications this can be something like system keychain on iOS/macOS, a local encrypted database, or an encrypted file storage.

### Not to be shared

> Unlike access tokens, refresh tokens are intended for use only with authorization servers and are never sent to resource servers.[^1]

Unlike a Access Tokens, a refresh token must not be shared with other Relying Parties (i.e. third-party applications).
The Client must store refresh tokens securely and only send it to the issuing authorization server's [Token Endpoint](./4-token-request.md).

[^1]: [OAuth 2.0 authorization framework (RFC 6749)](https://www.rfc-editor.org/rfc/rfc6749.html#section-1.5)