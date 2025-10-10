# OpenID Connect Token Request

The Token Endpoint is a crucial part of the OIDC and OAuth 2.0 flows. Unlike the Authorization Endpoint, which is accessed through the user's browser (front-channel), the Token Endpoint is designed for secure, direct, server-to-server communication (back-channel).

Its primary job is to exchange a grant (like an authorization code or a refresh token) for an [ID Token](id-token.md), Access Token, and optionally a Refresh Token. Because this happens on the back-channel, your application can securely authenticate itself (e.g., with a client_secret) without exposing sensitive credentials to the user's browser.

After the user authenticates at the Authorization Endpoint, they are redirected back to your application with an authorization code. Your application then makes a `POST` request to the Token Endpoint to exchange this code for tokens.

This request includes the following key parameters in the request body:

* `grant_type=authorization_code`: Tells the provider you are exchanging an authorization code.
* `code`: The single-use authorization code you received.
* `redirect_uri`: The same redirect_uri that was used in the initial Authentication Request. This is a security measure to ensure the request is coming from the correct party.
* `client_id`: Your application's unique ID.
* `client_secret`: A secret known only to your application and the provider. This is used by "confidential clients" (like a traditional web app) to authenticate. Public clients (like SPAs) using PKCE will instead use the `code_verifier` parameter.
