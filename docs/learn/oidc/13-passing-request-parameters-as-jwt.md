---
tags: [oidc, authentication, jwt]
---

# Passing Request Parameters as JWT

[OpenID Connect Core 1.0 incorporating errata set 2 -  Passing Request Parameters as JWTs](https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests)

The standard OpenID Connect (OIDC) [Authorization Request](3-authentication-request.md) relies on passing parameters via the query string of the Authorization Endpoint URL.
For use cases requiring data integrity, non-repudiation, or support for larger parameter sets, OIDC allows to communicate all the
A Request Object is a JSON Web Token (JWT) that encapsulates all the [standard Authorization Request parameters](3-authentication-request.md#auth-request-parameters) as Request Object in form of a JSON Web Token (JWT) by value or reference.

Passing parameters directly in the URL exposes them to potential third-party modification before reaching the Authorization Server.
By sending the parameters within a signed JWT (a JWS), the Client guarantees the Authorization Server receives them exactly as intended.
Using a JWE (JSON Web Encryption) within the Request Object can ensure confidentiality, protecting sensitive claims from observation by the User-Agent or intermediary proxies.

## Delivery Methods

The Request Object is transmitted to the Authorization Server using one of two specific [Authorization Request parameters](3-authentication-request.md#auth-request-parameters):

1.  **`request` Parameter**: The entire JWT is passed directly as the value of the `request` parameter. The Authorization Server processes the JWT immediately upon receipt.

    ```
    GET /authz?request=eyJhbGciOiJSUzI1...
    ```

2.  **`request_uri` Parameter**: A URL pointing to the Request Object is passed as the value of the `request_uri` parameter. The Authorization Server must retrieve the JWT from this URL before processing the request. This method is necessary when the JWT exceeds the limits of a standard URL, or when the Client requires a separate, secure channel for transmission.

## Request Object Structure

The Request Object is a standard JWT with the Authorization Request parameters serving as claims in the payload, alongside specific mandatory and recommended JWT claims:

  * **`iss` (Issuer):** **Mandatory**. Must be the **Client ID** of the requesting application.
  * **`aud` (Audience):** **Mandatory**. Must be the **Authorization Server's Issuer Identifier**.
  * **`exp` (Expiration Time):** **Mandatory**. Defines the time after which the JWT must not be accepted by the AS.
  * **`iat` (Issued At):** **Recommended**. The time the Request Object was created.
  * **`jti` (JWT ID):** **Recommended**. A unique identifier for the JWT, used by the AS to prevent replay attacks if a `request_uri` is used more than once.

Other standard OIDC parameters, such as `client_id`, `scope`, `response_type`, and `redirect_uri`, are included as claims within the JWT payload instead of being passed as separate URL query parameters.

## Client Registration

Clients must register their intent to use Request Objects via the `request_object_signing_alg` and `request_object_encryption_alg` metadata fields during Client Registration.
