# Initiating Login from a Third Party

[OpenID Connect Core 1.0 incorporating errata set 2 - 4.  Initiating Login from a Third Party](https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin)

Initiating Login from a Third Party describes a mechanism where a party other than the relying party (application) or the user can initiate an authentication request.

Instead of the user directly visiting the RP's site and clicking a login button, a third party (often the OpenID Provider itself) redirects the user to the RP's login initiation endpoint.

This method allows for seamless login experiences where a user might start their journey on one site and be automatically directed to another to complete the login process.

In large organizations a use case might be a central identity platform might host a directory of all available applications. A user logged into this portal can click on an application's icon, and the portal (acting as the third party) initiates the login flow to that specific application, providing a true Single Sign-On (SSO) experience.


```mermaid
sequenceDiagram
    participant T as Third Party (Portal)
    participant UA as User Agent (Browser)
    participant RP as Relying Party (Application)
    participant OP as OpenID Provider (Central IdP)
    
    Note over T,UA: User clicks a link on the Third Party site
    T->>UA: Redirect with iss, login_hint, target_link_uri
    
    UA->>RP: Navigates to RP's Login Initiation Endpoint
    Note over RP: RP receives and validates parameters
    RP->>UA: Redirect with Authentication Request
    
    UA->>OP: Navigates to OP's Authorization Endpoint
    Note over OP: User authenticates and consents
    OP-->>UA: Redirect with ID Token and/or Authorization Code
    
    UA-->>RP: Returns to RP's Redirect URI
    Note over RP: RP validates the tokens and establishes a session

```