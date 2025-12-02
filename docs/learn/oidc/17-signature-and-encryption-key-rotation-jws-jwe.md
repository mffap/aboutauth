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

### Example Signed JWT (JWS)

```json title="Signed JWT (JWS)"
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
OpenID Connect via [JSON Web Encryption (JWE) - RFC 7516](https://tools.ietf.org/html/rfc7516) uses a Hybrid Encryption, also known as Envelope Encryption.

The content, meaning payload of the JWE, is encrypted with a Content Encryption Algorithm (`enc` header).
A unique Content Encryption Key (CEK) is created for each payload that needs to be encrypted.

Content Encryption allows you to send the payload in an encrypted format.
The recipient (ie. RP) requires the CEK to decrypt the payload.
The Key Management Algorithm (`alg` header) determines how the random CEK is encrypted and sent to the recipient safely.
When encryption is requested, the RP provides a public key (via its own JWK Set) to the OP.
The OP uses this key to encrypt the CEK, and the CEK to create the cyphertext for the encrypted payload according to the algorithms defined in `alg` and `enc`, respectively.

Summary of the encryption flow: 

* Generate a random 256-bit key is created (The CEK).
* Encrypt the content, eg with A128CBC-HS256 using the CEK to encrypt the user's data (Claims).
* Encrypt the key, eg with RSA-OAEP using the Recipient's Public Key to encrypt the CEK.
* Send the JWE containing the RSA-encrypted-CEK + the AES-encrypted-Claims.

### Key Management Algorithms (`alg` Header)

| Algorithm (alg) | Logic | Recipient Requirement | Use Case |
| --- | --- | --- | --- |
| RSA-OAEP | Key Encryption. The Sender encrypts the CEK directly with the Recipient's Public RSA Key. | Must have an RSA Private Key. | Standard for backend-to-backend communication. |
| ECDH-ES | Key Agreement. The Sender and Recipient use their keys to mathematically derive the same CEK without sending it over the wire. | Must have an Elliptic Curve Key. | High performance, mobile devices. |
| A128KW | Key Wrapping. The Sender encrypts the CEK using a shared symmetric secret (like a password or client_secret). | Must have the Shared Secret. | Symmetric setups (less common in public OIDC). |
| DIR | Direct. No encryption of the key. The client_secret IS the CEK. | Must have the Shared Secret. | Simple setups where the client_secret is used directly to encrypt data. |

### Content Encryption Algorithms (`enc` Header)

| Algorithm (enc) | CEK Size (Bits) | Encryption Mechanism | Integrity Mechanism | Description |
| --- | --- | --- | --- | --- |
| A128GCM | 128 | AES-GCM | Built-in (GCM Tag) | Recommended. AES Galois/Counter Mode. Fast and secure. Provides both encryption and integrity in one step. |
| A256GCM | 256 | AES-GCM | Built-in (GCM Tag) | Same as above but with a stronger 256-bit key. |
| A128CBC-HS256 | 256 (128+128) | AES-CBC | HMAC-SHA-256 | Legacy/Compatibility. Uses AES-CBC for encryption and a separate HMAC for integrity. The CEK is split in half: first 128 bits for HMAC, second 128 bits for AES. |

### Order of Operations: Sign Then Encrypt

If a claim set is to be both signed and encrypted, OIDC strictly enforces a Sign then Encrypt order of operations:

1. The payload is signed to create a nested JWS
2. The JWS is used as the payload for the JWE

Concept: `JWE( JWS( Claims ) )`

This nesting guarantees that the payload is signed by the Issuer and encrypted for the Audience.
Reversing this order would result in an encrypted blob signed by the Issuer, providing weaker security assurances.

### Example: Encrypted JWS (JWE)

```text title="JWE"
eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.P_khFJ8TYLXSWuOFTavCe2pmKIsxDiu9PBj_UGuVuelpF3-5jYLa0CkSnF5uGEEu1uD7ZWWYtx0DJOnLU2yRn9T1JXZGD3aYiWSimmSpE78U0L15NPpURw5lF0QLCZ6rSrNe0VFfCyjBwNb8txenJD7FDIfxM8tAxr-4i3bFdFrwdqUzGq9v9hTw82skQj1EkZizcpOvvtxDxMuOJ5GH4ucKmzpa8X7rG5Gin_kkg2CPVSJ8NXsHsj25xwNcZzUXVaSYVv4bb8JeWMnIrXw96Rs946uMpxz4EPx_LrRubBZKrUNmvfjJBhtKEnA371ZIkwWoYnWRqWveG1ybOC0PAw.R2j5ouj2z3kVDD8Y.r4_ieYu13mx2QRMaeL8v607KprJT7KRvOqTsBFv9me9n2Ht6HqM8RSBGRnzBH-R43QSnjBsP1YS5ESy9AcfIISFGh_Hf5DzeUkdJHtDGPFfYvNQk-E22YmS6zQMRU85sFXrJDDvl4kgBbHeBDp0GTkFO37sFuBd8UJds5JjXenI2cmTPvY8n4gt7M61kN-qx3Fd2H1jvVImrVqw-UpgyvWi56_Z9PjJ4Sc-ZbmwRCwHvepP4T9fSA8BOh011wSYz0V_gLeoD8NKkDtcXU8INQQCP5vjl1OeEyIAdnJgkcKm_ExwphR9aP7WPAeVG_njC30o4lPDs-9rDr1dzOW13KR4rb8T1G127G4mlShcZ_1tE.5aF88qOmug-wJgkpPVIHRA
```

The JWE comes with five parts, separated by a `.` in the format `{ JWE Protected Header } . { JWE Encrypted Key } . { JWE Initialization Vector } . { JWE Ciphertext } . { JWE Authentication Tag }`.

```json title="Decoded JWE Header"
{
  "alg": "RSA-OAEP-256",  // Key Management Algorithm
  "enc": "A256GCM",    // Content Encryption Algorithm
  "kid": "key-id-1",
  "cty": "JWT"
}
```

Where: 

* `alg`: Defines how the Content Encryption Key (CEK) is encrypted (e.g., RSA-OAEP-256).
* `enc`: Defines the algorithm used to encrypt the actual payload/claims (e.g., A256GCM)

A JWE encrypts a signed JWT (JWS).
The following JWS is the same as in the previous example.

```json title="Signed JWT (JWS)"
eyJhbGciOiJFUzI1NiIsImtpZCI6IjFlOWdkazciLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZ2l2ZW5fbmFtZSI6IkphbmUiLCJmYW1pbHlfbmFtZSI6IkRvZSIsImlhdCI6MTUxNjIzOTAyMn0.wMxkjjG-GaZyN5YEdNcdFtxrP3uNoESaffiUGtt9JJ6SeGJWF9ACEDuTP_iVmunLbkDL899a5UlTr_eKCd-8cA
```

The following public JWK was used by OP to encrypt the token.

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

If you want to decrypt the JWE, you need the following private key that is used by the RP to decrypt the token.

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

Use a tool like [Authgears's JWE Debugger](https://www.authgear.com/tools/jwt-jwe-debugger) to encrypt or decrypt token.
The tool also allows you to generate a JWK.

## Key Discovery & Selection

To validate a signature or decrypt a message, the recipient must identify the correct key using the `kid` (Key ID) header parameter.

### Client Registration

When the RP registers with the OP, it provides its key configuration via:

* `jwks_uri`: A URL pointing to the RP's JSON Web Key Set. This is recommended over sending keys by value (`jwks`) as it allows rotation without re-registration.
* `id_token_encrypted_response_alg`: Specifies the supported Key Management Algorithms.
* `id_token_encrypted_response_enc`: Specifies the supported Content Encryption Algorithms.

### Token Issuance

When the OP needs to issue an encrypted ID Token:

1. Lookup the registered `jwks_uri`
2. Download the RP's JWK set.
3. OP selects a key where `use` is `enc` (Encryption) and the algorithm `alg` matches
4. OP encrypts the payload with the `enc` algorithm and the Content Encryption Key with the `alg` using the RP's Public Key.
5. OP sends the JWE to RP

## Key Rotation

Rotation ensures security hygiene.
The process differs significantly depending on who owns the key.

### Rotation of Signing Keys (OP Initiated)

The OP changes the key it uses to sign tokens. The RP reacts to this change.

1. **Generate:** OP generates a new key (`key-id-2`) and adds it to its JWKS. The old key remains published.
2. **Switch:** OP begins signing new tokens with `key-id-2`. Header: `"kid": "key-id-2"`.
3. **Detection:** RP receives the token, checks its cache, and sees the unknown `kid`.
4. **Fetch:** RP refreshes its cache from the OP's `jwks_uri`.
5. **Verify:** RP finds the new key and validates the signature.

### Rotation of Encryption Keys (RP Initiated)

The RP changes the key the OP uses to encrypt data. The OP must be updated proactively.

1. **Generate:** RP generates `key-id-2` and publishes it to its JWKS.
2. **Wait (Critical):** The RP **must retain the private key** for the `key-id-1`. The OP likely caches the RP's JWKS (e.g., for 1 hour).
3. **Transition:**
      * OP issues a token using its cached `key-id-1`.
      * RP receives the token (`kid: key-id-1`) and decrypts it using the retained old private key.
4. **Update:** The OP's cache expires. It fetches the RP's JWKS, sees `key-id-2`, and switches.
5. **Retire:** Once traffic on the old key ceases, the RP removes the old private key.
