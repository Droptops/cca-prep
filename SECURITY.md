# Security Policy

CCA Prep is a client-side study application and should not require secrets to run.

## Reporting

Please do not publish credentials, private data, or exploit details in a public issue. If you find a security-sensitive problem, use GitHub's private vulnerability reporting feature when available for this repository. If private reporting is unavailable, open a minimal issue that does not include sensitive details and ask the maintainer for a private channel.

## Secrets

Do not commit API keys, tokens, private keys, `.env` files, or credentials. The application should remain usable without embedding secrets in browser-delivered code.
