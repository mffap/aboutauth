---
sidebar_label: Scopes
tags: [oidc, scopes]
---

# Scopes In OpenID Connect

Scopes in OpenID Connect are values used during authentication to specify which user data a client application wants to access.
While [OAuth 2.0 uses scopes for permission to access resources](https://www.rfc-editor.org/rfc/rfc6749.html#section-3.3), OIDC uses them to request specific [claims about the authenticated user](standard-claims.mdx) or enable use of refresh tokens.

A claim is a piece of information about the user, like their name, email, or a unique identifier.
[Claims](standard-claims.mdx) are returned in the [ID Token](2-id-token.md) and/or through the UserInfo Endpoint.
Scopes are essentially a shorthand for requesting a bundle of these claims.

## Standard Scopes

The OpenID Connect specification defines several standard scopes to simplify common requests.
A client application includes these scopes in the `scope` parameter of its [authentication request](authentication-request.md).
The OpenID Provider (OP) then returns the corresponding [claims](standard-claims.mdx) if the user consents.

* `openid`: This is a **mandatory** scope for any OIDC request. It signals to the Authorization Server that the client application intends to use OIDC to verify the user's identity. In return, the OP must at least provide a `sub` claim, which is a unique identifier for the user.
* `profile`: Requests basic profile information, which are name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, and updated_at.
* `email`: Requests the user's `email` address and whether it has been `email_verified`.
* `address`: Requests the user's physical `address`.
* `phone`: Requests the user's `phone_number` and whether it has been `phone_number_verified`.
* `offline_access`: Requests a Refresh Token which allows the application to get new Access Tokens without user interaction, enabling long-lived or [offline access](17-offline-access.md) to resources. This is an OAuth 2.0 scope, but it's defined within the OIDC spec for convenience.

For a full list of standard claims associated with these scopes, refer to [Standard Claims](standard-claims.mdx).

## Consent

When an application requests these scopes, the user is often presented with a consent screen.
This screen lists the information the application is requesting, allowing the user to grant or deny access.
This provides transparency and control for the user, a key principle of modern identity management.
