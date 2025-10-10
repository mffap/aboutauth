---
tags: [oidc]
---

# Important OpenID Connect Endpoints and Their Requests

Category | Endpoint | URL
--- | --- | ---
Authentication | [Authorization](#authorization-endpoint) | /authorize
Authentication | Token | /token
Profile | UserInfo | /userinfo
Validation | Keys | /.well-known/jwks.json <br /> (non-normative)
Validation | Introspection | /introspect
Validation | Check Session Iframe | /check_session <br />  (non-normative)
Termination | Revocation | /revoke
Termination | End Session | /end_session <br />  (non-normative)
Configuration | Discovery | /.well-known/openid-configuration
Configuration | Dynamic Client Registration | /register

## Authorization Endpoint

[OpenID Connect Core 1.0 - Authorization Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint)

The Authorization Endpoint `/authorize` is the starting point of the OIDC authentication flow. The client application (Relying Party) redirects the user's browser to this endpoint at the OpenID Provider to authenticate the user and obtain their consent. The request to this endpoint is the [**Authentication Request**](authentication-request.md).

:::note Example URL
https://idp.aboutauth.com/authorize
:::

## Token Endpoint

[OpenID Connect Core 1.0 - Token Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint)

The Token Endpoint `/token` is used by the client application to exchange a grant (like an authorization code or a refresh token) for an Access Token, ID Token, and/or Refresh Token. This interaction happens on the back-channel, away from the user's browser, allowing the client to authenticate securely.

Example URL:
```
https://idp.aboutauth.com/token
```

### Token Request

After receiving an authorization code, the client sends a [Token Request](./token-request) to the Token Endpoint to obtain the tokens. The Token Request is a `POST` request to the Token Endpoint.

### Refresh Token Request

[OpenID Connect Core 1.0 - Refreshing Access Tokens](https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken)

When an Access Token expires, the client can use a Refresh Token Request to obtain a new Access Token without requiring the user to log in again.

## UserInfo Endpoint

https://openid.net/specs/openid-connect-core-1_0.html#UserInfo

## Keys Endpoint

https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata

https://idp.aboutauth.com/.well-known/jwks.json

## Introspection Endpoint

https://datatracker.ietf.org/doc/html/rfc7662

https://idp.aboutauth.com/introspect

[Introspection Request](https://datatracker.ietf.org/doc/html/rfc7662#section-2.1)

## Revocation Endpoint

https://datatracker.ietf.org/doc/html/rfc7009

https://idp.aboutauth.com/revoke

Post

## End Session Endpoint

Redirect, Parameters

https://idp.aboutauth.com/end_session

## Discovery Endpoint

https://idp.aboutauth.com/.well-known/openid-configuration

## Dynamic Client Registration Endpoint

https://openid.net/specs/openid-connect-registration-1_0.html
[OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)

https://idp.aboutauth.com/register

## Check Session Iframe Endpoint

https://openid.net/specs/openid-connect-session-1_0.html

https://idp.aboutauth.com/check_session

Redirect, Parameters