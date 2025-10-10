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
Validation | [Introspection](#introspection-endpoint) | (POST) `/introspect` | Validating (opaque) tokens
Validation | [Check Session Iframe](#check-session-iframe-endpoint) | (iframe) `/check_session`[^1]| Validating user session
Termination | [Revocation](#revocation-endpoint) | (POST) `/revoke` | Revoking tokens
Termination | [End Session](#end-session-endpoint) | (Redirect) `/end_session`[^1] | End user session
Configuration | [Discovery](#discovery-endpoint) | (GET) `/.well-known/openid-configuration` | Retrieving IDP endpoints and capabilities
Configuration | [Dynamic Client Registration](#dynamic-client-registration-endpoint) | (POST) `/register` | Register client application

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

[OpenID Connect Discovery 1.0 - Provider Metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata)

The Keys Endpoint (often exposed via the `jwks_uri` in the discovery document) publishes the provider's public keys as a JSON Web Key Set (JWKS).
Client applications use these keys to validate the signature of ID Tokens, ensuring they are authentic and were issued by the correct provider.

:::note Example URL
https://idp.aboutauth.com/.well-known/jwks.json
:::

## Introspection Endpoint

[OAuth 2.0 Token Introspection - RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662#section-2.1)

The Introspection Endpoint allows a client or resource server to check the validity of a token.
The client makes an authenticated `POST` request with the token, and the server responds with its status (e.g., whether it's active) and other metadata.

:::note Example URL
https://idp.aboutauth.com/introspect
:::

## Check Session Iframe Endpoint

[OpenID Connect Session Management 1.0](https://openid.net/specs/openid-connect-session-1_0.html)

The Check Session Iframe Endpoint helps a client monitor the user's login status at the provider without a full page redirect.
The client loads this endpoint in a hidden iframe and uses `postMessage` to poll whether the user's session is still active.

:::note Example URL
https://idp.aboutauth.com/check_session
:::

## Revocation Endpoint

[OAuth 2.0 Token Revocation - RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009)

The Revocation Endpoint allows a client to invalidate a token (like an access or refresh token) before it expires.
This is crucial for scenarios like user logout.
The client sends an authenticated `POST` request containing the token to be revoked.

Note:
Sessions can be terminated server side, but clients might still receive a token.
It is crucial that the client validates the token, e.g. via [Introspection Endpoint](#introspection-endpoint) or [UserInfo Endpoint](#userinfo-endpoint) with a risk-based approach, i.e. on each request or every few minutes.
Opaque / Bearer tokens instead of JWT tokens are an additional security measure.

:::note Example URL
https://idp.aboutauth.com/revoke
:::

## End Session Endpoint

[OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html)

The End Session Endpoint is used to log the user out of their session at the OpenID Provider.
The client redirects the user's browser to this endpoint, often including an `id_token_hint` to identify the session and a `post_logout_redirect_uri` to return the user to the application afterward.

:::note Example URL
https://idp.aboutauth.com/end_session
:::

## Discovery Endpoint

[OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)

The Discovery Endpoint provides a machine-readable JSON document containing the provider's configuration, including the URLs of all other endpoints and its supported capabilities. This allows for automatic client configuration.

:::note Example URL
https://idp.aboutauth.com/.well-known/openid-configuration
:::

## Dynamic Client Registration Endpoint

[OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html). 
[OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)

This endpoint allows client applications to register with an OpenID Provider programmatically.
Instead of manual setup, a client can send a `POST` request with its metadata (e.g., application name, redirect URIs) to dynamically receive a `client_id` and other configuration details.

:::note Example URL
https://idp.aboutauth.com/register
:::

[^1]: non-normative: the standards don't define the endpoint's url or name, but this naming convention is used among the major providers.