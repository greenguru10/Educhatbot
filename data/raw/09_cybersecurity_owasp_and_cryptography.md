# Cybersecurity Fundamentals: OWASP Top 10 and Cryptography

## Web Security & The OWASP Top 10
The Open Worldwide Application Security Project (OWASP) maintains a consensus list of the most critical security risks to web applications:
1. **Broken Access Control**: Failures in enforcing authorization policies, allowing users to view or modify data outside their permitted privileges (e.g. Insecure Direct Object References / IDOR).
2. **Cryptographic Failures**: Exposing sensitive data in transit or at rest due to weak algorithms (MD5, SHA1) or missing HTTPS/TLS.
3. **Injection**: SQL Injection, Command Injection, and LDAP Injection occurring when untrusted input is interpreted as command syntax. Prevented using parameterized queries / prepared statements.
4. **Cross-Site Scripting (XSS)**: Injecting malicious client-side scripts into web pages viewed by other users. Mitigated via strict output encoding and Content Security Policy (CSP).
5. **Cross-Site Request Forgery (CSRF)**: Forcing an authenticated end user to execute unauthorized actions on a web application. Mitigated via anti-CSRF tokens and SameSite cookie attributes.

## Symmetric vs Asymmetric Cryptography
- **Symmetric Encryption**: Uses the same single secret key for both encryption and decryption (e.g. AES-256, ChaCha20). Fast, ideal for bulk payload encryption.
- **Asymmetric Encryption**: Uses a mathematically linked key pair: a public key for encryption and a private key for decryption (e.g. RSA, ECC, Ed25519). Used for digital signatures, identity verification, and TLS key exchange.
