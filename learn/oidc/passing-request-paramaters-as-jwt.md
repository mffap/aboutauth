---
# sidebar_position:
tags: [oidc, jwt]
---

# Passing Request Parameters as JWTs

https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests

In OpenID Connect, "Passing Request Parameters as JWTs" refers to a method for sending authorization request parameters in a more secure way compared to traditional URL-encoded queries. Here's a breakdown:

* **Traditional Method:** Parameters like `scope` and `redirect_uri` are included directly in the URL of the authorization request. This approach is vulnerable to eavesdropping and manipulation as the information travels in plain text.

* **JWT Approach:** The request parameters are encoded as claims within a JSON Web Token (JWT). This JWT, called a **Request Object**, is then sent as a separate parameter in the authorization request.

There are two main benefits to this approach:

* **Security:** The JWT is digitally signed by the relying party (RP), ensuring the integrity of the data. The OpenID Provider (OP) can verify the signature and trust the origin of the request.
* **Confidentiality (Optional):** The JWT can be encrypted in addition to being signed. This protects the content from unauthorized access during transit between the RP and OP.

Here are some additional points to consider:

* Not all OpenID Providers support Request Objects. You should check the provider's documentation to see if it's an available option.
* The Request Object can contain only a subset of the original request parameters. Some parameters, like `client_id` and `response_type`, might still be sent in the URL for compatibility reasons.

Overall, using JWTs for request parameters enhances the security of OpenID Connect authorization requests, particularly when dealing with sensitive information.
