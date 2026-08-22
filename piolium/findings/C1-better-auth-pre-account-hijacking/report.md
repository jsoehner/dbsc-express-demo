# Finding C1: better-auth pre-account hijacking

## Summary
A vulnerability in the `better-auth` library (GHSA-qq9h-g4jm-xgf3) allows for pre-account hijacking. This occurs when an attacker can claim or access an account before the legitimate owner completes the verification process for magic-links or email-OTP sign-ins.

## Details
The issue stems from a logic flaw or race condition in the authentication flow. When a user initiates a registration or sign-in via a verification link, the account may enter a "pre-account" state. If the system does not strictly enforce ownership checks during this state, an attacker can complete the flow and gain access to the account.

## Root Cause
The `better-auth` library's handling of pre-account states does not sufficiently validate that the entity completing the verification is the same entity that initiated it.

## Proof of Concept
1. Attacker identifies a target email address.
2. Attacker initiates a magic-link or email-OTP sign-in for the target email.
3. Before the legitimate owner can interact with the verification link/OTP, the attacker completes the flow by providing the necessary credentials or clicking the link.
4. The attacker now has full access to the account.

## Impact
Full account takeover for any user who uses magic-links or email-OTP for authentication.

## Mitigation
Update `better-auth` to a version that includes the fix (>= 1.6.26). Additionally, ensure that the `emailAndPassword` flow is configured to require proper ownership checks.

## PoC-Status
theoretical
