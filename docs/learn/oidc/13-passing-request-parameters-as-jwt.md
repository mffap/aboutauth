---
tags: [oidc, authentication, jwt]
---

# Passing Request Parameters as JWT and Reference

[OpenID Connect Core 1.0 incorporating errata set 2 -  Passing Request Parameters as JWTs](https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests)

The standard OpenID Connect (OIDC) [Authorization Request](3-authentication-request.md) relies on passing parameters via the query string of the Authorization Endpoint URL.
For use cases requiring data integrity, non-repudiation, or support for larger parameter sets, OIDC allows to transmit the Authorization Request parameters as a Request Object.
A Request Object encapsulates all the [standard Authorization Request parameters](3-authentication-request.md#auth-request-parameters) in form of a JSON Web Token (JWT) by value or reference.

Passing parameters directly in the URL exposes them to potential third-party modification before reaching the Authorization Server.
By sending the parameters within a signed JWT (a JWS), the Client guarantees the Authorization Server receives them exactly as intended.
Using a JWE (JSON Web Encryption) within the Request Object can ensure confidentiality, protecting sensitive claims from observation by the User-Agent or intermediary proxies.

## Delivery Methods

The Request Object is transmitted to the Authorization Server using one of two specific [Authorization Request parameters](3-authentication-request.md#auth-request-parameters).

### Passing Request Parameters as JWT

The entire JWT is passed directly as the value of the `request` parameter.
The Authorization Server processes the JWT immediately upon receipt.

Parameters sent as JWT supersede URL parameters.
You could include `state` and `nonce` in the JWT payload, but the Authorization Server should take the values from the URL parameters.
Sending more static payloads as JWT can act as a pre-configured authentication scenario.

:::info Mandatory Parameters
For the request to be a valid OAuth 2.0 authorization request `response_type`, `client_id`, `cope` must be included in the URL parameters.
To indicate the underlying OpenID Connect process `scope` must contain at least the `openid` scope.

The parameter values must match the the values in the request object.

For first time users this may be confusing. OpenID Connect is an extension to OAuth 2.0, this leads to these kinds of conditions when using certain features of OpenID Connect.
:::

```http title="Passing parameters as JWT in an Authorization Request"
GET /authorize? HTTP/1.1
  //highlight-start
  response_type=code%20id_token
  &client_id=s6BhdRkqt3
  &scope=openid
  //highlight-end
  &state=af0ifjsldkj
  &nonce=n-0S6_WzA2Mj
  //highlight-start
  &request=eyJhbGciOiJSUzI1NiIsImtpZCI6ImsyYmRjIn0.eyJpc3MiOiJzNkJoZFJrcXQzIiwiYXVkIjoiaHR0cHM6Ly9pZHAuYWJvdXRhdXRoLmNvbSIsInJlc3BvbnNlX3R5cGUiOiJjb2RlIGlkX3Rva2VuIiwiY2xpZW50X2lkIjoiczZCaGRSa3F0MyIsInJlZGlyZWN0X3VyaSI6Imh0dHBzOi8vYXBwLmFib3V0YXV0aC5vcmcvY2IiLCJzY29wZSI6Im9wZW5pZCIsIm1heF9hZ2UiOjg2NDAwLCJjbGFpbXMiOnsidXNlcmluZm8iOnsiZ2l2ZW5fbmFtZSI6bnVsbCwibmlja25hbWUiOm51bGwsImVtYWlsIjp7ImVzc2VudGlhbCI6dHJ1ZX19LCJpZF90b2tlbiI6eyJlbWFpbCI6eyJlc3NlbnRpYWwiOnRydWV9LCJhY3IiOnsiZXNzZW50aWFsIjp0cnVlLCJ2YWx1ZXMiOlsidXJuOm1hY2U6aW5jb21tb246aWFwOnNpbHZlciJdfX19fQ.BdVs6nmYQE_yevKrgZBzufhyVEyExG7LMVSTDsYgin3xXPUmy3nYGLCR48xpmcm_LEdA8usyrctVW_Sybcd4ENW7kQJISzqinnYRcfH1qaAA1jbPJGuB3KNpCc6DrN9wOnStA7Yt2n_hZmm2vQ4BWhrXFby_wuFUQLTWOWiqfoo2kr35UxuSNMTW8110W7Xdz473yohh3ZVtceIQo1mgaF6WV-3WAp8tG_eG5RrbQIzN4EjbtwjbQ2H2E_UvncTsuy79jyMQCBblNVQDvXrRx-dt4MgqEDps2OkSYQPElZR33DbdjE6g-IMtfFoq5AqKgWRwQiRAY8inA6kGB-t5Eg
  //highlight-end
Host: idp.aboutauth.com
```

The following payload is sent as signed JWT in the `request` parameter:

```json title="JWT Payload"
{
  "iss": "s6BhdRkqt3",
  "aud": "https://idp.aboutauth.com",
  "response_type": "code id_token",
  "client_id": "s6BhdRkqt3",
  "redirect_uri": "https://app.aboutauth.org/cb",
  "scope": "openid",
  "max_age": 86400,
  "claims": {
    "userinfo": {
      "given_name": null,
      "nickname": null,
      "email": {
        "essential": true
      }
    },
    "id_token": {
      "email": {
        "essential": true
      },
      "acr": {
        "essential": true,
        "values": [
          "urn:mace:incommon:iap:silver"
        ]
      }
    }
  }
}
```

<details>

<summary>JWT Header & Signature</summary>

```json title="JWT Header"
{
  "alg": "RS256",
  "kid": "k2bdc"
}
```

```json title="Private Key"
{
  "kty": "RSA",
  "use": "sig",
  "key_ops": [
    "sign"
  ],
  "alg": "RS256",
  "kid": "6db56554-61bc-449b-9df1-5983982529c2",
  "d": "CZ9TBFBNAqLl-XXzukAi902L-N0lZ5_rlhHRnfrJ03sUKacTNDH6bsyrz19EXrl5BRFr2SNulQfwgHsnHkeno98D52W8NRfHywc_TlJbTzZIWx4zYLh3nt2ypd_4d84JbVh5gtkSJdNmoxs9IbRfsOJuYViHrQBcx-MVu4ewobms2HyIkYGOKsy1pL9LDkIRo4aPfhZ8N99g7WAWOfSImbKF5lwma6LtE0gjkVg35qs8SuZuppMVNBrvMfcSxC3Ux3uTIlRwT_SnPePvHbbuDjsvYtA_TUHkEDHsrdO26BNRFlHHtThWp8ybS2o0ioMoecfr0Y8r_jEM9s_apeDKUQ",
  "n": "21inucXiKjLPJaiqROhVboxyMLehrrt0jpg8iBgz2ObE2ekaYYTR2w5j6R9oza0qszHbXSoXug7q7yPZTftc1IQe2IWHr9wa9pCi6UONGHNcpBFRjot482JZiilYwaAe7qC18c4L1WWjy885sfQxQ5hJtUjW6MNXjUzPhqveSh5ltZyiYjgbDVhABCdF7OdB4EQvdOkz-KxoH_h0V2-dNWGQrS7eE2HolMO1QAriNt8CoJyJBloyzRBSgJ8Nom5XvGHmNqn3kNwUcbdp_Puv6IYgr1_Q8532hpwGg0h85QN2HhZDi6dGu8dAQyPdc50mKENVpx3LeNbtFK2pfHgtGw",
  "e": "AQAB",
  "p": "5GQaWcrj9f7YHDIWeOsxAahXNcfOVBM_KWFajH645VQKHBekdAUc4C0mg82iP8bgV7uNScbRYkOJa82azLQYYNaPZUdxomJPh08zrahdm616vE3YlJo8W6jOZssIsyf6gH_lSt3RadiYfTtcEL_iN5pVMLcS1aaXEImy-ZIxHLk",
  "q": "9dymbin45375MxhqZWZotALWiOOwy-spUp-KFZxz4t4gBGZX221WVTsSvnLffFY_wwNyqNpnnwMl5_Rwje5fI79pu8z58fPIjI1Z4njxcbZCXbPtF1nl--qJmxyQ7i0IJMEbsAUBPPP9ETVqTtHaixkorneRXeF41eB6KA8DdnM",
  "dp": "1brf9fuqjQCqGOi-ovXl7Jku08Nh0MgaKY1TgXrtaJ7WvydY3MIUHa3jByEenvRr6W44cDxAoeZ16Y6FON-omKbxlmPfcYjyx7tUr0SKJS-ZVjK7ZYVYyqYUUZnbUF0vTaViXEdsu9LYEQnFxF7tQf-JjYcldw7o-68A8BDhKPE",
  "dq": "gDjyJ3QGVp0W0_oAyx9MrczpG_07YC4ln-yKdFji60eTBRhm644rP0oOrXp1aYAFwuvSaZN2BSz8IOuPo8XUom0adJIjLHdKeVrirMUMjpRSKlJC7TG6StZ3q4iLYVvk6l431WXWznYk3kuwRKkXRAH8AHllO8PyZACtVKT31lc",
  "qi": "GaKPo6gbW_D-RC2VaXskJus4oqs89Org_glOiSnTBKjFgy0XqIf0Hw8x8rkAHPdCff1suF_yJI6ffUal0FvN3jKRwNNDj-0zVfCbnZjFPJSzFV_pNhE7rubfC9bRjOehayXsDVd-gAgDhoqRMgighgv8mehZEaQnOQDfQn9WOOc"
}
```

</details>

### Passing Request Parameters by Reference

The application exposes an URL where the Request Object is available and passes the URL in the `request_uri` parameter of the Authorization Request.
The Authorization Server must retrieve the JWT from this URL before processing the request.
This method is necessary when the JWT exceeds the limits of a standard URL, or when the Client requires a separate, secure channel for transmission.

```http title="Passing parameters by reference in an Authorization Request"
GET /authorize? HTTP/1.1
    response_type=code%20id_token
    &client_id=s6BhdRkqt3
    &scope=openid
    &state=af0ifjsldkj
    &nonce=n-0S6_WzA2Mj
    //highlight-start
    &request_uri=https%3A%2F%2Fclient.example.org%2Frequest.jwt%23GkurKxf5T0Y-mnPFCHqWOMiZi4VS138cQO_V7PZHAdM
    //highlight-end
Host: idp.aboutauth.com
```

```http title="Authorization Server fetches the Request Object"
GET /request.jwt#GkurKxf5T0Y-mnPFCHqWOMiZi4VS138cQO_V7PZHAdM HTTP/1.1
Host: app.aboutauth.org
```

The relying party (application) should prevent the Authorization Server to cache the request_uri by using a distinct URI for each Authorization Request (eg, by appending a fragment).

## Client Registration

Clients must register their intent to use Request Objects via the `request_object_signing_alg` and `request_object_encryption_alg` metadata fields during Client Registration.
