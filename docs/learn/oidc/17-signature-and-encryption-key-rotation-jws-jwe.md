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
eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.P_khFJ8TYLXSWuOFTavCe2pmKIsxDiu9PBj_UGuVuelpF3-5jYLa0CkSnF5uGEEu1uD7ZWWYtx0DJOnLU2yRn9T1JXZGD3aYiWSimmSpE78U0L15NPpURw5lF0QLCZ6rSrNe0VFfCyjBwNb8txenJD7FDIfxM8tAxr-4i3bFdFrwdqUzGq9v9hTw82skQj1EkZizcpOvvtxDxMuOJ5GH4ucKmzpa8X7rG5Gin_kkg2CPVSJ8NXsHsj25xwNcZzUXVaSYVv4bb8JeWMnIrXw96Rs946uMpxz4EPx_LrRubBZKrUNmvfjJBhtKEnA371ZIkwWoYnWRqWveG1ybOC0PAw.R2j5ouj2z3kVDD8Y.r4_ieYu13mx2QRMaeL8v607KprJT7KRvOqTsBFv9me9n2Ht6HqM8RSBGRnzBH-R43QSnjBsP1YS5ESy9AcfIISFGh_Hf5DzeUkdJHtDGPFfYvNQk-E22YmS6zQMRU85sFXrJDDvl4kgBbHeBDp0GTkFO37sFuBd8UJds5JjXenI2cmTPvY8n4gt7M61kN-qx3Fd2H1jvVImrVqw-UpgyvWi56_Z9PjJ4Sc-ZbmwRCwHvepP4T9fSA8BOh011wSYz0V_gLeoD8NKkDtcXU8INQQCP5vjl1OeEyIAdnJgkcKm_ExwphR9aP7WPAeVG_njC30o4lPDs-9rDr1dzOW13KR4rb8T1G127G4mlShcZ_1tE.5aF88qOmug-wJgkpPVIHRA
```

```json title="JWE Header"
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM"
}
```


```json title="JWK Private Key for Decrpytion"
{
{
  "kty": "RSA",
  "alg": "RSA-OAEP-256",
    "kid": "psC/5tqcoGg/mifwsOpQMfgJmAS9SUi8JdGKTs8puAs=",
  "key_ops": [
    "decrypt"
  ],
  "d": "Ew2LZqvU_6eJY_K1FamoGY9d4KhcMzQ1aPRy0HViZyFzniIZGPUbDAKV_tcEtJejElV3OAG64x5pxprl3WmthcMSKQG7cPe7DjS0ItHDasjJBS5N64td0nT00vzSwb__Qk79i5F2MGU3dVOTT0xMkGBoxzRBm1biJLpXNo0y_vhQ9K0UDPvLmFK0OB1EnySm1bxBIhFtN4wXGFQW50iN4tviz5vkr7AbE8fATRbhJWRXRJVcvZhaQ-qrPoJtINjMIydfNHYM9N2vFxppWFd0GZfr77fIpCYTvKASbka7JzQLiiST7uVnwx7ZR-hRYSdzzKyqjeGEM6fJMMn2lcHezQ",
  "dp": "wCajO5zMwy5hhLx4R2_n-DXxfekrC1eUPkv_T1Ev8EZ_a4q4H6LLHgD8UNzTQaYmv3b1xuCjeriHhFlHdjAdGBG06buLQsvJpCW3Fofkk68Nxn7vLSNOEOMZpSvJq1LA_-En0ijPdBLG1f_Weku_7azr6p32RLM49OEaAI2NH0U",
  "dq": "vYvGOoh3ckMVUqqgxh_5ZOOUOzQ-I7DDTqbVT4SuFoNf5_kXvBtXdhpI3F_tjZ4Qdhyir1u0l3xNd19YilzEzd99KvVLepAgL0vuADNFN6gll5BxEEZQAf5oRejsKB81rCDLavIyQrEuuFsZwPZUJgMn0ZhKzXGVwykr8QLgfZk",
  "e": "AQAB",
  "ext": true,
  "n": "vUdNqICqkbJaFh94-J3t4uAKjlkNmpQHL3QizhCkZnDgH-MZTahgl2emVkPkWvkyLKWupKZa6luxf0T5w62w5IKJ6vaWb_XpVcomtZsdZaO2gEPMEoV3ZdEsMoLXoC38IZ2BhARCWhVWXQSkfd6zEys8P_3bvW3Cv_NsupfKJQAg6W32MYcCAP1T0bo4QXCtVYmEo6SWh_G6ooQ5-tTwiJbbTahnrq6InbsPnDjwfDYo3UNvheYerAhRqi4YiLCLY2ZOvzCBnx9IbcIbmCANYJY6KBU8VrVnt782uwYXQS__jZcwynqU6Dw6ilTGnEz4misXhrCdjKrCMwbmohptHQ",
  "p": "6ObWX-KlsSyc3Nmp-zWfDghvhxJnN34UnSbvfe7u1tlRHQiC4CZh28pNOH09g6Na6-erhkGh_JdUGaV5NnluAS_8MNNM8sk0KmGRLG8lM9eXo0MPMsuL2gPbQsFWNoG6yuW9j5DNIEqEelX7j0BQ36-E754hZqmofG9j9I8gIgc",
  "q": "0Azpv8ABEzOr66AcePIoZGsOUK0egoH-YqgfYK8O6sqjoGjSAiySQzOidRq-zUStk8UtsBuYJwmbr_-E-OfMLwJ_81HIQu9td4CqdKkfnsghVq97mqPagtlEf71Cs4rAk3NDms3S6oaQ5BH7fWKMplGo3QgHKLdQeLt7O6kFXrs",
  "qi": "gvz2Ov447W4UYog-acRVMD6Z5APE-X59gh7Zs32NOYEq77DqNMVMwQ4AuOSl5EXv4_usNtP0LNBDRT770t4Cp7j3ZOO8e8kf6NgyN6Gl50CW8c0m9ttJNz_NX36C_3-FMa_ZpzNYYyeKbSDwfk3ASlPgKRiGXARSnc47qOMNPVM",
  "use": "enc"
}
```

```json title="JWK Public Key for Encryption"
{
  "kty": "RSA",
  "alg": "RSA-OAEP-256",
  "kid": "psC/5tqcoGg/mifwsOpQMfgJmAS9SUi8JdGKTs8puAs=",
   "key_ops": [
    "encrypt"
  ],
  "e": "AQAB",
  "ext": true,
  "n": "vUdNqICqkbJaFh94-J3t4uAKjlkNmpQHL3QizhCkZnDgH-MZTahgl2emVkPkWvkyLKWupKZa6luxf0T5w62w5IKJ6vaWb_XpVcomtZsdZaO2gEPMEoV3ZdEsMoLXoC38IZ2BhARCWhVWXQSkfd6zEys8P_3bvW3Cv_NsupfKJQAg6W32MYcCAP1T0bo4QXCtVYmEo6SWh_G6ooQ5-tTwiJbbTahnrq6InbsPnDjwfDYo3UNvheYerAhRqi4YiLCLY2ZOvzCBnx9IbcIbmCANYJY6KBU8VrVnt782uwYXQS__jZcwynqU6Dw6ilTGnEz4misXhrCdjKrCMwbmohptHQ",
  "use": "enc"
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