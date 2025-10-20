---
sidebar_label: "Aggregated and Distributed Claims"
tags: [oidc, claims]
---

# Aggregated and Distributed Claims in OpenID Connect

## Distributed Claims

```mermaid
flowchart-elk LR
%%{ init : { "theme" : "forest", "flowchart" : { "**curve" : "stepBefore**" }}}%%
    
    CP1 --> RP
    CP2 --> RP
    CP3 --> RP
    IdP --> RP
```