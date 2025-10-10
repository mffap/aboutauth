---
tags: [oidc]
---

# Important OpenID Connect Endpoints and Their Requests

Category | Endpoint | Request | Description
--- | --- | --- | ---
Authentication | [Authorization](#authorization-endpoint) | (Redirect) `/authorize` | Starting the authentication flow
Authentication | [Token](#token-endpoint) | (POST) `/token` | Retieving access, refresh, and ID tokens
Profile | [UserInfo](#userinfo-endpoint) | (GET, POST) `/userinfo` | Retrieving user information (claims)
Validation | [Keys](#keys-endpoint) | (GET) `/.well-known/jwks.json`[^1] | Retrieving public keys used for validating tokens
Validation | [Introspection](#introspection-endpoint) | `/introspect` | Validating (opaque) tokens
Validation | [Check Session Iframe](#check-session-iframe-endpoint) | `/check_session`[^1]| Validating user session
Termination | [Revocation](#revocation-endpoint) | `/revoke` | Revoking tokens
Termination | [End Session](#end-session-endpoint) | `/end_session`[^1] | End user session
Configuration | [Discovery](#discovery-endpoint) | `/.well-known/openid-configuration` | Retrieving IDP endpoints and capabilities
Configuration | [Dynamic Client Registration](#dynamic-client-registration-endpoint) | `/register` | Register client application

## Authorization Endpoint

[OpenID Connect Core 1.0 - Authorization Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint)

The Authorization Endpoint `/authorize` is the starting point of the OIDC authentication flow.
The client application (Relying Party) redirects the user's browser to this endpoint at the OpenID Provider to authenticate the user and obtain their consent. 

The request to this endpoint is the [**Authentication Request**](authentication-request.md).

:::note Example URL
https://idp.aboutauth.com/authorize
:::

## Token Endpoint

[OpenID Connect Core 1.0 - Token Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint)

The Token Endpoint `/token` is used by the client application to exchange a grant (like an authorization code or a refresh token) for an Access Token, ID Token, and/or Refresh Token. This interaction happens on the back-channel, away from the user's browser, allowing the client to authenticate securely.

You can call the token endpoint with a [Token Request](./token-request) during an authentication flow, or the Refresh Token Request when you have a refresh token and want to receive a new access token without re-authenticating.

:::note Example URL
https://idp.aboutauth.com/token
:::

### Token Request

After receiving an authorization code, the client sends a [Token Request](./token-request) to the Token Endpoint to obtain the tokens. The Token Request is a `POST` request to the Token Endpoint.

### Refresh Token Request

[OpenID Connect Core 1.0 - Refreshing Access Tokens](https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken)

When an Access Token expires, the client can use a Refresh Token Request to obtain a new Access Token without requiring the user to log in again.

## UserInfo Endpoint

[OpenID Connect Core 1.0 - UserInfo Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo)

The UserInfo Endpoint is a protected resource where a client can retrieve claims about the authenticated user.
To access this endpoint, the client must present the Access Token it received from the Token Endpoint.
The claims are returned as a JSON object.

A critical security step is to verify that the `sub` (subject) claim in the UserInfo response matches the `sub` from the ID Token to prevent token substitution attacks.

:::note Example URL
https://idp.aboutauth.com/userinfo
:::

### UserInfo Request

The client makes an authenticated `GET` or `POST` [UserInfo Request](./11-userinfo-request.md) to the UserInfo Endpoint, including the user's Access Token in the `Authorization` header.

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

[^1]: non-normative: the standards don't define the endpoint's url or name, but this naming convention is used among the major providers.