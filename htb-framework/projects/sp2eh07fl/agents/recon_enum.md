# Agent: Reconnaissance and Scanning

## Description
**Reconnaissance and Scanning (Enumeration)**

**What it is:** The initial phase of penetration testing where you gather information about the target system without directly interacting with it in a way that could alert defenders.

**Purpose:** To understand the attack surface, identify potential entry points, and collect intelligence that will guide the rest of the assessment.

**Main Points:**
- Passive reconnaissance (no direct interaction)
- Active scanning and enumeration
- Service and port identification
- Network mapping and topology discovery

**Main Techniques:**
- WHOIS lookups and DNS enumeration
- Google dorks and OSINT gathering
- Port scanning with Nmap (TCP, UDP, SYN scans)
- Service version detection and fingerprinting
- Directory enumeration with tools like Gobuster/Dirbuster
- Web application scanning with Nikto

**Obtained Results:**
- IP ranges and domain information
- Open ports and running services
- Operating system identification
- Web application structure and technologies
- Potential usernames and email addresses

**Examples:**
- Discovering that port 80/443 is open with Apache web server
- Finding hidden directories like /admin or /backup
- Identifying vulnerable services like outdated FTP servers
- Mapping the network topology and firewall rules

## Learned Context
Analysis of 5 steps in the Reconnaissance and Scanning phase.

## Successful Commands
- `nmap -sV -sC -T4 meow.htb`
- `telnet mew.htb`

## Failed Commands
- None

## Identified Patterns
- Successful commands identified

## Creation Date
2026-03-22T21:06:08.605Z
