---
tags: [oidc]
---

# Offline Access in OpenID Connect

[OpenID Connect Core 1.0 incorporating errata set 2 - Offline Access](https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess)

In OpenID Connect, offline access is a [scope value](standard-openid-connect-scopes.md), `offline_access`, that a client can request to obtain a Refresh Token from the Authorization Server.
This Refresh Token allows the client to get new Access Tokens without the user being actively authenticated, enabling access to resources even when the user is offline.

## How to request offline access

Developers request this access by including the `offline_access` [scope](standard-openid-connect-scopes.md) in the [authorization request](authentication-request.md).

## Consent for offline access

The Authorization Server obtains user consent by presenting the user with a consent screen.
This screen is part of the OAuth 2.0 or OpenID Connect authorization flow, using the [prompt parameter](authentication-request.md) `prompt=consent` and serves as the mechanism for the resource owner (the user) to grant or deny a client (the application) access to their protected resources.

After successful authentication, the Authorization Server displays a dedicated consent screen to the user.
This screen is crucial because it provides transparency.
It clearly outlines the name of the application requesting access, and specific permissions (scopes) being requested, such as "View your profile information" or "Access your email address".

The standard allows for "other conditions  for processing".
This refers to situations where the user has already provided prior, enduring consent for the client to have offline access.
For example, in a native application where the client and Authorization Server have a pre-existing business or contractual relationship with the user, a fresh consent prompt may not be necessary every time the user authenticates.
However, this is an exceptional case.
In most standard web application flows, the Authorization Server must explicitly obtain consent from the user to provide a Refresh Token.

## When to use `offline_access`

Offline access is used when a client application needs to perform actions on a user's behalf without the user being actively logged in or present.
This is essential for applications that require long-lived access to resources.
Examples are  

**Native Mobile Applications**
Mobile applications frequently use offline access.
Once a user logs in, they expect to stay logged in until they explicitly log out.
Rather than forcing a re-login every few minutes or hours, the app uses a Refresh Token to maintain the user's session in the background.
This provides a good user experience, allowing the app to fetch new data or upload content even when the user isn't actively using the app.
Developers should be aware of connectivity issues and should employ strategies to handle these situations.

**Server-Side Applications**
A common use case is a backend service that needs to access a user's data periodically.
For instance, a calendar synchronization service that pulls event updates from a user's calendar provider once an hour.
The service runs in the background and can't prompt the user for credentials each time it needs to perform an update.

**Command-Line Interfaces (CLIs)**
For developer tools, a CLI might need to interact with an API on a user's behalf.
Once a user authenticates the CLI, they don't want to re-authenticate for every command.
The `offline_access` scope provides a long-lived token that allows the CLI to perform various API calls over an extended period.
This is often seen with cloud provider CLIs or other tools that manage remote resources.

## References

* [The OAuth 2.0 Authorization Framework - Refresh Token](https://www.rfc-editor.org/rfc/rfc6749.html#section-1.5)