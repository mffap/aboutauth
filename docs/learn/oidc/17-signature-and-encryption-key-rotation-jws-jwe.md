---
sidebar_label: Signature and Encryption
tags: [oidc, encryption, signing, jwt, jws, jwe, jose]
---

# Use of Signatures and Encryption in OpenID Connect

[OpenID Connect Core 1.0 - Signature and Encryption](https://openid.net/specs/openid-connect-core-1_0.html#SigEnc)

OpenID Connect uses  specific cryptographic methods to ensure the integrity and confidentiality of [ID Tokens](2-id-token.md), [UserInfo responses](11-userinfo-request.md), Client Authentication JWT, and [Request Objects](13-passing-request-parameters-as-jwt.md).
The [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html#SigEnc) dictates how JOSE (JSON Object Signing and Encryption) standards are applied in the context of OpenID Connect.

## Digital Signature

Signing ensures that the sender is authentic and the message has not been tampered with.
OIDC uses [JSON Web Signature (JWS) - RFC 7515](https://tools.ietf.org/html/rfc7515) to sign contents.

The OpenID Provider (OP) must verify signatures on [Request Objects](13-passing-request-parameters-as-jwt.md), and the Relying Party (RP) must verify signatures on [ID Tokens](2-id-token.md).

### Signing Algorithms

The signing algorithm is specified in the `alg` header parameter of the JWT.
Based on the [JSON Web Algorithms (JWA) - RFC 7518](https://www.rfc-editor.org/rfc/rfc7518.html) it's recommended to use one of the following required or recommended cryptographic algorithms for JWS.

Algorithm | Type | Implementation Requirements | Description
--- | --- | --- | ---
ES256 | Asymmetric | Recommended (future default) | Uses the Elliptic Curve Digital Signature Algorithm (ECDSA) with the P-256 elliptic curve. More efficient than RSA based algorithms, such as PS256 or RS256.
RS256 | Asymmetric | Recommended | RSA Signature with SHA-256. Fast verification and widely supported. Less efficient than ES256 due to longer key length.
HS256 | Symmetric | Required | HMAC using SHA-256. Use only for internal systems where OP and RP are within the same trusted environment.

Asymmetric algorithms allow the OP to sign tokens with a private key while the RP verifies them using public keys exposed via the `jwks_uri`.
Symmetric keys are derived from the `client_secret`. If the `client_secret` contains more entropy than required by the hash function, it must be truncated.

## Example Signed JWT (JWS)

```json title="Signed JWT"
eyJhbGciOiJFUzI1NiIsImtpZCI6IjFlOWdkazciLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZ2l2ZW5fbmFtZSI6IkphbmUiLCJmYW1pbHlfbmFtZSI6IkRvZSIsImlhdCI6MTUxNjIzOTAyMn0.wMxkjjG-GaZyN5YEdNcdFtxrP3uNoESaffiUGtt9JJ6SeGJWF9ACEDuTP_iVmunLbkDL899a5UlTr_eKCd-8cA
```

The JWS comes in the format `{ JWS Header } . { JWS Payload } . { JWS Signature }`.
Header and payload are concatenated and hashed to produce the Signature.

```json title="JWT Protected Header"
{
  "alg": "ES256",
  "kid": "1e9gdk7",
  "typ": "JWT"
}
```

```json title="JWT Payload"
{
  "sub": "1234567890",
  "name": "John Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "iat": 1516239022
}
```

The following JWK was used for singing the JWT.

```json title="Public JSON Web Key"
{
  "kty": "EC",
  "alg": "ES256",
  "kid": "1e9gdk7",
  "crv": "P-256",
  "x": "rJ_XvfJ1zNmn-ahQr00g7pwcF-LKQrDuRy4PoBZ9bkg",
  "y": "ZA66P7oFMPXWe4xECCRBlRx1C9bFlMHLQ-GQqc7XXok"
}
```

If you require the private key, add the following Private Key (scalar) parameter "d":  
`"d": "mY7-VS0kh-TkDvh4ma8sseRdb4Nno8D5sJPSfh57ySI"`

Verify the signature by using a tool like [JWT Debugger](https://www.jwt.io/).
Paste the JWS, then select `JWK` as "Public Key Format" and past the JWK.

## Encryption

Encryption ensures that only the intended recipient can read the message content.
OpenID Connect uses [JSON Web Encryption (JWE) - RFC 7516](https://tools.ietf.org/html/rfc7516).

When encryption is requested, the RP provides a public key (via its own JWK Set) to the OP.
The OP uses this key to encrypt the token.

### Order of Operations: Sign then Encrypt

If a claim set is to be both signed and encrypted, OIDC strictly enforces a **Sign then Encrypt** order.

1.  The payload is signed to create a nested JWS.
2.  The JWS is used as the payload for the JWE.

This nesting guarantees that the payload is signed by the Issuer and encrypted for the Audience. Reversing this order would result in an encrypted blob signed by the Issuer, providing weaker security assurances.

### Example: Nested JWS inside JWE

Concept: `JWE( JWS( Claims ) )`

The JWE Header for a nested token usually includes the content type `cty` to indicate the payload is a token:

```json
{
  "alg": "RSA-OAEP",
  "enc": "A128GCM",
  "cty": "JWT",
  "kid": "7890"
}
```

```text title="JWE"
eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.L-sZSL8tJ_DNjgSme6qZ6ZV8JW9_aEvCN3lbjFZlz9mJX5KV2O_if3zUgK0cP4h0odU2k_-G_be2o9C03GCWhnd-8YSfrjSNcSDKjepSFVZVdEFKGPU1SDk0cB-gNQ1D7679QjdTv6Eav5jvqpG-E16S9NsRyTTt9CJc2kg1CQGJig-JANjjPQgLRkmOTFncJS9hcKSd5nVCaMJQKlcy7NDlQpgZlD9dTHDRFktlTbr4TFBUn5xHHzqXquyErPfFJYaqzN9GjR4ibJidbFmmD32c8lJCSfzdX2ObwfzdBEzQQq2fFa29gaYi6mwsvZg9jCflamjyAVLPphc_--arBA.4RudA8n7kCHGomQc.xR6fuKYlQpnhLoZea2szkXLrKa5SehTEyc6xaDfyDVhc-ioTZCFpHxmpdS-t-zXnX99JyEqkVMCVwxjVO8l5jxybwhIBIl6zgJs-Yap_jozc7EAd7KfmyRSbCuEd32t7m2CXlaqw3pUwK6O6sKSRSAq1dyvqjdaniLCT_Lqqi4gnucQSeq3HV4QL2KRVqUyO40ZC0oTbmRtdAHLwVXWgqIDKZaX4wlFXcFtykayHgPbDRtY1kTmAJLrIo7TLwSCdZiMGXxyPaA2-rhxgtisuH6P06i4BTLs9nYSDIgcj7q0iSyOhk_VvZ2jyh2DTr22aMn7YE1E4WoYShKRMjecN5ror4ZVRjIHBeiYSOv4xMgiQ.agf8_YqdnWelZGWFE9JlCA
```

```json title="JWE Header"
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM"
}
```


```json title="JWK Private Key for Encryption"
{
  "kty": "RSA",
  "alg": "RSA-OAEP-256",
  "kid": "53f90728-44ca-4ece-9418-e0155d91f866",
  "d": "gqRX1GktHWy2p05brcH41oqBSK4xc7i2ZwRLTdp_hdloqqn0RtYMYb1YQ7LU2BEWF0EW3SRQQX78QrhFU5IFp2wU_8ci9PhieN2ENpKcJxxVcfBU4tKGchSAG2zlCO2Ugi3-y28YqnclI9TwEb6-cdUCLBCRbFc6nUUr7x_Bm0AVkVF_12438vQmksRTAv0ODB1B6LeQ44lzY0XdMBR0eQBPGjVLWeUrSW9ZeqyOk4gwhnIDnjBJykiNdFnu41N-vQfnKOkn3zAuD0wlySJbFsMFMo46gR-spUsYAA7_nQnM8wD-bo_WYc9MJHXz5h9SKCF0-ogsCiNnEQ-viFSZCQ",
  "n": "zilQxKtf60AL9W2uCpA1m3H5rs07eMuH61qqUXo4ZHU1qofgpC4HkX-fvvloWnpcV5N_htsPbxyNGN6m4HKQOhowLb1FTH5v4D3riQxImbbFwxvEyytEr3n6jOVDMFsdsp4Uy2f9sR8aKr5AeDg4BiLdZpPAz15LNOAWzzbnLUAgNv6VIssHww2yUICdZoXK4Jq3W7td5ZlPWL0qJ5jiX0IOKqDVV9OR5709BE5AspNfgQQ6W2VNQZXPHmkq64iQJVfRN1mI86idCoeJtWNIy8N1lPl2i2mhGxZ2befyIAy9neInsNQ8k4-uZeftKe2FC5fdUzK5_SoXdN13_DZMwQ",
  "e": "AQAB",
  "p": "1A5CSLWMqCHd0owNcaKsVmt9oVLw0TweCKpJVGxh08w7FGDd89df194RzCwzAOXcBGARV7dK6lBgvo5hlebDMZquuTYDdd5YDHOsBiKWGKj7zK3EIojKv2KG8yMiXlH_0JiGlTuoRAC45V30f32ZIDA4a3R-niw23cHmospJtfM",
  "q": "-OJbtd26WiYJolqRVwrGRx5c2T4zhCYLxaKfLcgGyaY-EiVb7cYH0ikqOIcYl0T2jRqx5tgBoZEw-ShdEno1lRRUBsCyP9unf0uzuTG5_cRuAfQ-Nd8G_y4QhaCbyTYhejnT8CgUlAAYeLNQyhlXrxb-22Ob_Z84eqeeDVOH23s",
  "dp": "P3lZK-x0AuvIOzrC123rCh84xq5N-UN2df-K3aNnkP9D-_CW32Nrg_EsAKKGTdGADys2Zbwux35xxvhVi4o8iT-U50mctY5taqTBLED0DsOeQ4EMAY5SqgDzBhpRMkx3N1hAiLEHx_szXSzHf9X3nOPyL2_6apwvfCeLQtUsRTM",
  "dq": "VxohLozi4xnc1U0NAIFs0wb1R7JVJTKLfCdlvgf7GCduIbuhaJ2drxdpB0-Ac7BW-RsWl8uRBpJhqVFPAWBz0DDFF3fo6iBdhldgFrgod39_YH-yJfhf4n6kmZ-T5d9j5_rFCY99ZC6EYfmflJs57LUHjJBXz3MhuQtgbRmGunE",
  "qi": "s1PPOFQmuhHHlCRPEqk4qJY3xvYtzEacPEPvDfgg5Vc8pj7y-3rxdnmGwm0NZGLzUq-1NIm9ymYx0JdxUMARrU5DHKOGAiw5TzKBqsKf-Bp5sRCWvJCF5vI3JLE9CdaMF09IuHLk8YRER8VdoDwiDCE5yen70vlx7ewvpWYJ_Y0"
}
```

```json title="JWK Public Key for Encryption"
{
  "kty": "RSA",
  "alg": "RSA-OAEP-256",
  "kid": "53f90728-44ca-4ece-9418-e0155d91f866",
  "n": "zilQxKtf60AL9W2uCpA1m3H5rs07eMuH61qqUXo4ZHU1qofgpC4HkX-fvvloWnpcV5N_htsPbxyNGN6m4HKQOhowLb1FTH5v4D3riQxImbbFwxvEyytEr3n6jOVDMFsdsp4Uy2f9sR8aKr5AeDg4BiLdZpPAz15LNOAWzzbnLUAgNv6VIssHww2yUICdZoXK4Jq3W7td5ZlPWL0qJ5jiX0IOKqDVV9OR5709BE5AspNfgQQ6W2VNQZXPHmkq64iQJVfRN1mI86idCoeJtWNIy8N1lPl2i2mhGxZ2befyIAy9neInsNQ8k4-uZeftKe2FC5fdUzK5_SoXdN13_DZMwQ",
  "e": "AQAB"
}
```

## Key Discovery & Selection

To validate a signature or decrypt a message, the recipient must identify the correct key using the `kid` (Key ID) header parameter.

### 1\. The Setup (Client Registration)

When the RP registers with the OP, it provides its key configuration:

  * **`jwks_uri`:** A URL pointing to the RP's JSON Web Key Set. This is recommended over sending keys by value (`jwks`) as it allows rotation without re-registration.
  * **Algorithms:** The RP specifies `id_token_encrypted_response_alg` (for the key) and `id_token_encrypted_response_enc` (for the content).

### 2\. The Execution (Token Issuance)

When the OP needs to issue an encrypted ID Token:

1.  **Lookup:** The OP checks the registered `jwks_uri`.
2.  **Fetch:** The OP downloads the JWK Set.
3.  **Selection:** The OP looks for a key where `use` is `enc` (Encryption) and the algorithm matches.
4.  **Encryption:** The OP encrypts the payload using the RP's Public Key.

## Key Rotation

Rotation ensures security hygiene. The process differs significantly depending on who owns the key.

### 10.1.1 Rotation of Signing Keys (OP Initiated)

The OP changes the key it uses to sign tokens. The RP reacts to this change.

1.  **Generate:** OP generates a new key (`New_Key`) and adds it to its JWKS. **Crucially**, the old key remains published.
2.  **Switch:** OP begins signing new tokens with `New_Key`. Header: `"kid": "New_Key"`.
3.  **Detection:** RP receives the token, checks its cache, and sees the unknown `kid`.
4.  **Fetch:** RP refreshes its cache from the OP's `jwks_uri`.
5.  **Verify:** RP finds the new key and validates the signature.

### 10.2.1 Rotation of Encryption Keys (RP Initiated)

The RP changes the key the OP uses to encrypt data. The OP must be updated proactively.

1.  **Generate:** RP generates `New_Enc_Key` and publishes it to its JWKS.
2.  **Wait (Critical):** The RP **must retain the private key** for the `Old_Enc_Key`. The OP likely caches the RP's JWKS (e.g., for 1 hour).
3.  **Transition:**
      * OP issues a token using its cached `Old_Enc_Key`.
      * RP receives the token (`kid: Old_Enc_Key`) and decrypts it using the retained old private key.
4.  **Update:** The OP's cache expires. It fetches the RP's JWKS, sees `New_Enc_Key`, and switches.
5.  **Retire:** Once traffic on the old key ceases, the RP removes the old private key.