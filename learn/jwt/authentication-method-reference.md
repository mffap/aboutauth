# Authentication Method Reference (AMR) Values

https://datatracker.ietf.org/doc/html/rfc8176

According to the article, Authentication Method Reference (AMR) values are defined and registered in the IANA "JSON Web Token Claims" registry to specify the authentication methods used in authentication.

AMR values are used to signal to the relying party (client) additional information about what the identity provider did during the authentication process.

Some of the defined AMR values include:

* face
* fpt (fingerprint), 
* geo (geolocation), 
* hwk (hardware-secured key), 
* iris, 
* kba (knowledge-based authentication), 
* mca (multi-channel authentication), 
* mfa (multi-factor authentication), 
* otp (one-time password), 
* pin, 
* pwd (password), 
* retina, 
* sc (smart card), 
* sms (confirmation via SMS text message), 
* swk (software-secured key), 
* tel (confirmation by telephone call), 
* user (user presence test), 
* vbm (voiceprint)
* wia (Windows integrated authentication)

Related

* OIDC Spec
* JWT
* https://www.iana.org/assignments/jwt/jwt.xhtml

References

* [OpenID Connect MODRNA Authentication Profile 1.0](https://openid.net/specs/openid-connect-modrna-authentication-1_0.html)