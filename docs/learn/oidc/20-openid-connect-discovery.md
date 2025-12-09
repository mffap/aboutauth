---
sidebar_label: OpenID Connect Discovery
tags: [oidc, standard, oidc.discovery]
---

# OpenID Connect Discovery

[[OIDC.Discovery] OpenID Connect Discovery 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-discovery-1_0.html)

OpenID Connect Discovery enables Relying Parties to discover the OpenID Provider's configuration by querying a standardized path `/.well-known/openid-configuration`.

:::note Rely on discovery
Hardcoding authentication URLs and signing keys into your application is error prone, as endpoints change and keys rotate.
Always use an [OIDC-compliant library](/resources#openid-connect-clients) that accepts an "Authority" or "Issuer" URL.
These libraries automatically fetch this discovery document to configure themselves.
This ensures your application handles key rotation gracefully and stays up-to-date with endpoint changes without a redeployment.
:::

## Discovery Endpoint

To find the configuration for a given issuer (e.g., `https://id.aboutauth.com`), the relying party (the application) performs an HTTP GET request to the issuer's domain with the path `/.well-known/openid-configuration` appended to it.

For example, these are the discovery endpoints for some public OpenID Connect providers:

| Issuer | Discovery URL |
| --- | --- |
| Google | `https://accounts.google.com/.well-known/openid-configuration` |
| Microsoft | `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration` |
| Facebook | `https://www.facebook.com/.well-known/openid-configuration` |

:::info Discovery Endpoint without supporting OpenID Connect
The fact that some issuers publish a discovery url is not sufficient to conclude that the issuer is an OpenID provider.
OpenID Providers must support the `code`, `id_token`, and the `id_token token` Response Type values (`response_types_supported`).
Issuers such as [Apple](https://account.apple.com/.well-known/openid-configuration), [Github](https://github.com/login/oauth/.well-known/openid-configuration) or [Slack](https://slack.com/.well-known/openid-configuration) publish a discovery endpoint but don't fully support OpenID Connect authentication flows.
:::

## Example Metadata

Here is a simplified example of what a discovery response looks like:

```json
{
  "issuer": "https://id.aboutauth.com",
  "authorization_endpoint": "https://id.aboutauth.com/authorize",
  "token_endpoint": "https://id.aboutauth.com/token",
  "userinfo_endpoint": "https://id.aboutauth.com/userinfo",
  "jwks_uri": "https://id.aboutauth.com/.well-known/jwks.json",
  "scopes_supported": [
    "openid",
    "profile",
    "email"
  ],
  "response_types_supported": [
    "code",
    "id_token",
    "token id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ], 
  "claims_supported": [
    "aud",
    "email",
    "email_verified",
    "exp",
    "family_name",
    "given_name",
    "iat",
    "iss",
    "name",
    "picture",
    "sub"
  ]
}
```

## Understanding the Metadata

The returned JSON object contains several critical fields that drive the authentication flow.

### Identity and Security

The `issuer` value is a case-sensitive URL that uniquely identifies the provider.
It is the most critical value and the Relying Party (RP) must verify that this value matches the issuer claim (`iss`) in any [ID Token](2-id-token.md) it receives.

To validate signatures, your RP needs the provider's public keys.
The `jwks_uri` field points to a JSON Web Key Set (JWKS) document.
RP should fetch this document dynamically to handle [key rotation](17-signature-and-encryption-key-rotation-jws-jwe.md) automatically without code changes.

### Endpoints

The metadata provides the locations of [OpenID Connect Endpoints](openid-connect-endpoints-and-requests.mdx) for interacting with the IdP.

The `authorization_endpoint` is where you redirect the user's browser to begin the login flow.
Once the user authenticates, your backend exchanges the returned code for tokens at the `token_endpoint`.
If you need additional user details, the `userinfo_endpoint` allows you to retrieve profile information using an Access Token.
`registration_endpoint` is the endpoint for dynamic client registration.

### Capabilities

The metadata also lists what the provider supports.

* `scopes_supported` tells you which [scopes](9-standard-openid-connect-scopes.md) (like `openid`, `email`, `profile`) you can request
* `response_types_supported` indicates which flows are allowed (e.g., `code` for the [Authorization Code flow](authorization-code-flow-with-proof-key-for-code-exchange-pkce.md))
* `subject_types_supported` defines how the provider identifies users. [Subject identifier types](15-public-and-pairwise-sub-identifiers.md) can be `public` (same user ID for all clients) or `pairwise` (different user IDs to prevent tracking)
* `id_token_signing_alg_values_supported` is a list of [JWS (JSON Web Signature) algorithm identifiers](17-signature-and-encryption-key-rotation-jws-jwe.md) that the OpenID Provider (OP) supports for signing ID Tokens. RP inspects this to choose a compatible `alg` when requesting ID Tokens and to verify the token's signature. Keys for verifying signed ID Tokens must be published via `jwks_uri`
* `claims_supported` lists the claim names the provider may return in [ID Tokens](2-id-token.md) and from the [UserInfo endpoint](11-userinfo-request.md). Relying Parties inspect this to know which user attributes can be requested or relied upon; if a claim is not advertised, the RP should not expect it to be present.

### Required Metadata

| Metadata Field | Description/Purpose | Example Values/Notes |
| :--- | :--- | :--- |
| **`issuer`** | The URL that uniquely identifies the OpenID Provider. | Must match the `iss` claim in the ID Token. |
| **`authorization_endpoint`** | The URL where the user is redirected to initiate the login flow. | `https://op.example.com/authorize` |
| **`token_endpoint`** | The URL for exchanging the authorization code for tokens (ID Token, Access Token). | `https://op.example.com/token` |
| **`jwks_uri`** | The URL of the JSON Web Key Set (JWKS) document containing the public keys used for signature validation. | Dynamic key fetching prevents manual key rotation. |
| **`response_types_supported`** | A JSON array of `response_type` values supported by the OP. | `code`, `id_token`, `token id_token` |
| **`subject_types_supported`** | A JSON array detailing how the OP identifies users. | `public` (sub is the same for all clients), `pairwise` (sub is unique per client). |
| **`id_token_signing_alg_values_supported`** | A JSON array of signing algorithms supported for the ID Token. | `RS256` is mandatory; others like `HS256` or `ES256` are common. |

### Recommended Metadata

| Metadata Field | Description/Purpose | Example Values/Notes |
| :--- | :--- | :--- |
| **`userinfo_endpoint`** | The URL of the UserInfo Endpoint where client apps can retrieve user profile data. | Provides access to claims not included in the ID Token. |
| **`registration_endpoint`** | The URL of the Dynamic Client Registration Endpoint. | Used to programmatically register new clients. |
| **`scopes_supported`** | A JSON array of OAuth 2.0 `scope` values the server accepts. | `openid` (required for OIDC), `email`, `profile`. |
| **`claims_supported`** | A JSON array of the specific claims (data points) the server can return. | `sub`, `iss`, `name`, `email`, `picture`. |

### Optional Metadata

| Metadata Field | Description/Purpose | Example Values/Notes |
| :--- | :--- | :--- |
| **`response_modes_supported`** | A JSON array of `response_mode` values supported. | `query`, `fragment`, `form_post` |
| **`grant_types_supported`** | A JSON array of `grant_type` values supported. | `authorization_code`, `refresh_token`, `implicit` (Defaults if omitted) |
| **`acr_values_supported`** | A JSON array of Authentication Context Class References (ACR) supported. | Used to request specific authentication methods/levels. |
| **`id_token_encryption_alg_values_supported`** | A JSON array of key encryption algorithms supported for encrypted ID Tokens. | `RSA-OAEP`, `A128KW` |
| **`id_token_encryption_enc_values_supported`** | A JSON array of content encryption algorithms supported for encrypted ID Tokens. | `A128CBC-HS256`, `A256GCM` |
| **`userinfo_signing_alg_values_supported`** | A JSON array of signing algorithms supported for the UserInfo Endpoint response. | `RS256` or `none` |
| **`userinfo_encryption_alg_values_supported`** | A JSON array of key encryption algorithms supported for encrypted UserInfo responses. | `RSA-OAEP` |
| **`userinfo_encryption_enc_values_supported`** | A JSON array of content encryption algorithms supported for encrypted UserInfo responses. | `A128CBC-HS256` |
| **`request_object_signing_alg_values_supported`** | A JSON array of signing algorithms supported for Request Objects. | `RS256`, `none` |
| **`request_object_encryption_alg_values_supported`** | A JSON array of key encryption algorithms supported for Request Objects. | `RSA-OAEP` |
| **`request_object_encryption_enc_values_supported`** | A JSON array of content encryption algorithms supported for Request Objects. | `A128CBC-HS256` |
| **`token_endpoint_auth_methods_supported`** | A JSON array of Client Authentication methods supported at the Token Endpoint. | `client_secret_basic`, `private_key_jwt` |
| **`token_endpoint_auth_signing_alg_values_supported`** | A JSON array of signing algorithms supported for the Token Endpoint when using JWT authentication. | Used with methods like `private_key_jwt`. |
| **`display_values_supported`** | A JSON array of `display` parameter values supported. | `page`, `popup`, `touch` |
| **`claim_types_supported`** | A JSON array of the Claim Types supported. | `normal`, `aggregated`, `distributed` |
| **`service_documentation`** | A URL to human-readable webpage containing developer documentation. | Public documentation link. |
| **`claims_locales_supported`** | A JSON array of languages and scripts supported for values in Claims. | BCP47 language tags. |
| **`ui_locales_supported`** | A JSON array of languages and scripts supported for the user interface. | BCP47 language tags. |
| **`claims_parameter_supported`** | Boolean specifying whether the OP supports the `claims` parameter. | Defaults to `false`. |
| **`request_parameter_supported`** | Boolean specifying whether the OP supports the `request` parameter. | Defaults to `false`. |
| **`request_uri_parameter_supported`** | Boolean specifying whether the OP supports the `request_uri` parameter. | Defaults to `true`. |
| **`require_request_uri_registration`** | Boolean specifying whether the OP requires `request_uri` values to be pre-registered. | Defaults to `false`. |
| **`op_policy_uri`** | A URL to the OpenID Provider's policy regarding user data use. | Privacy policy link. |
| **`op_tos_uri`** | A URL to the OpenID Provider's Terms of Service. | Terms of Service link. |
