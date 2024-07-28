# Authentication Context Reference (ACR)

Authentication Context Reference (ACR) values are used in OpenID Connect (OIDC) to communicate the [Level of Assurance](../authentication/level-of-assurance) that was performed during the authentication process between a client (e.g., a relying party application) and an identity provider (IdP).

In simpler terms, it tells the application what level of verification the user went through to login. There isn't a predefined set of values, but it is something that the client and the IdP agree upon beforehand. The client can choose to reject the login if it feels the level of verification wasn't strong enough.

There aren't any universally agreed upon values for ARC values.
Instead, they are established ahead of time between the client and the IdP via [OpenID Connect Discovery](../oidc/oidc-discovery) Metadata `acr_values_supported`.
The client can then decide whether to accept the login based on the kind ACR value it receives from the IdP.

Related

* [ID Token](../oidc/id-token)
* [Level of Assurance](../authentication/level-of-assurance)