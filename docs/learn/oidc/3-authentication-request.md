---
tags: [oidc, authentication, oauth2]
---

# Authentication Request

[OpenID Connect Core 1.0 incorporating errata set 2 - AuthRequest](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest)

A core mechanic of authentication in OpenID Connect (OIDC) is the authentication request (auth request), which is essentially an OAuth 2.0 authorization request with added OIDC-specific parameters. Let's break down what this request entails and its significance.

Imagine you're building a web application that needs to authenticate users.
Instead of managing usernames and passwords directly, you leverage an OpenID Connect provider like Google, Keycloak, or Zitadel.
Your application redirects the user's browser to the provider's authorization endpoint, initiating the authentication process.
This redirection carries the authentication request as query parameters in the URL.

## Auth request parameters

OpenID Connect uses the following mandatory OAuth 2.0 request parameters with the Authorization Code Flow:

* `scope`: (required) This parameter defines the permissions your application requests as [scopes](9-standard-openid-connect-scopes.md). For OIDC, it must include *openid*, which signals that an ID token should be returned. Additionally, it can include [other scopes](9-standard-openid-connect-scopes.md) like *profile*, *email*, or *phone* to request user information. When requesting the special scope [offline_access](17-offline-access.md) a refresh token will be issued.
* `response_type`: (required) This crucial parameter specifies the desired authorization flow and the type of token to be returned. For OIDC, it typically includes *code* for the authorization code flow, or *id_token* (and optionally *token*) for the implicit flow or hybrid flow.
* `client_id`: (required) This identifies your client application to the OIDC provider, ensuring that the provider knows which application is requesting authentication.
* `redirect_uri`: (required) This indicates the URL where the OIDC provider should redirect the user after authentication, along with the authorization code or tokens. It's a critical security measure, as the provider will only redirect to pre-registered URIs.
* `state`: (recommended) A randomly generated string used to maintain state between the request and callback. This parameter acts as a security measure to prevent cross-site request forgery (CSRF) attacks.
* `response_mode`: (optional) This is used to specify how the authorization server should return the authorization response parameters to the client application. Essentially, it dictates the method used to deliver the tokens or authorization codes[^1]. The *form_post* parameter is often considered more secure than *query* or *fragment* for certain scenarios, as it reduces the risk of exposing sensitive data in the browser's history.

OpenID specifies the following request parameters for authentication:

* `nonce`: (optional) This parameter is crucial for mitigating replay attacks, especially when using implicit or hybrid flows. It's a unique value that the client includes in the request and the OIDC provider returns in the ID token.
* `prompt`: (optional) Specifies whether the authorization server prompts the user for re-authentication or consent: **none** avoids prompts or interaction, returning errors if interaction is needed, *login* forces re-authentication, *consent* always shows the consent screen, *select_account* prompts account selection. The IdP might support more values.
* `max_age`: (optional) Specifies the maximum allowable elapsed time in seconds since the last time the end-user was actively authenticated. If the elapsed time is greater than this value, the user must be re-authenticated.
* `ui_locales`: (optional) An ordered list of preferred languages (RFC5646) and locales for the user interface.
* `id_token_hint`: (optional) Previously issued ID Token passed as a hint about the end-user's current or past authenticated session with the client. Can improve the user experience by avoiding prompts, eg in combination with *prompt=none*.
* `login_hint`: (optional) Hint about the login identifier the end-user might use to log in. Very common scenario when redirecting a user to an external IdP and pre-selecting the account.
* `acr_values`: (optional) Requests specific Authentication Context Class Reference (ACR) levels, indicating desired authentication strength. The client sends ACR values, like "mfa" or "level3," and the server attempts to authenticate accordingly. The resulting ID token's acr claim shows the actual level used. Servers define the available ACR values.
* `display`: (optional) Specifies how the authorization server displays the authentication and consent user interface. Default is *page* instructing the authorization server to display full-page authentication / consent UI. Other accepted values are *popup* (pop-up view), *touch* (optimized for touch interfaces), and *wap* ("feature phone").
* `registration`: (optional) This allows a client to dynamically register itself with the authorization server during the authentication process. Instead of pre-registering the client, this parameter provides client registration information directly within the initial request[^2].
* `claims`: (optional) This allows a client application to request specific [claims](10-standard-claims.mdx) (user attributes) from the authorization server. It provides a structured way to define which user information the client needs beyond the standard scopes. The "claims" parameter allows for more fine-grained control over which specific claims are requested, beyond the standard scopes[^3].
* `claims_locales`: (optional) This is used to request that claims (user attributes) be returned in specific languages or locales. It allows client applications to specify their preferred languages for user information[^4].
* `request`: (optional) This provide mechanisms for passing authorization request parameters in a more secure and flexible manner than embedding them directly in the URL's query string. This parameter carries the entire authorization request as a JSON Web Token (JWT). This allows for signing or encrypting the request, enhancing security and preventing tampering[^5].
* `request_uri`: (optional) This parameter provides a URI where the authorization server can retrieve the authorization request JWT. Instead of embedding the JWT directly in the URL, the client provides a reference to it[^5].

## References

* [OAuth 2 Authorization Request](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1)

[^1]: [OAuth 2.0 Multiple Response Type Encoding Practices](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html) and [OAuth 2.0 Form Post Response Mode](https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html)  
[^2]: [OpenID Connect Core 1.0 incorporating errata set 2 - RegistrationParameter](https://openid.net/specs/openid-connect-core-1_0.html#RegistrationParameter)
[^3]: [OpenID Connect Core 1.0 incorporating errata set 2 - ClaimsParameter](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter)  
[^4]: [OpenID Connect Core 1.0 incorporating errata set 2 - ClaimsLanguagesAndScripts](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsLanguagesAndScripts)  
[^5]: [OpenID Connect Core 1.0 incorporating errata set 2 - JWTRequests](https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests)
