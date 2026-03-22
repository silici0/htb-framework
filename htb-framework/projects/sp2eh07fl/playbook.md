# Playbook: Meow

**IP:** 10.10.10.10
**URL:** N/A
**Start Date:** 2026-03-21T14:47:15.177Z

## recon_enum

### Step 1: What does the acronym VM stand for?
**Status:** ✅ Success

**Description:**
A virtual machine (VM) is a software-based emulation of a physical computer that runs on a host machine, acting as a separate, isolated computer system with its own operating system, CPU, memory, and storage. It allows multiple, distinct operating systems to run simultaneously on a single physical server or desktop.

**Results:**
```
Virtual Machine
```

---

### Step 2: What tool do we use to interact with the operating system in order to issue commands via the command line, such as the one to start our VPN connection? It's also known as a console or shell.
**Status:** ✅ Success

**Description:**


**Results:**
```
terminal
```

---

### Step 3: What service do we use to form our VPN connection into HTB labs?
**Status:** ✅ Success

**Description:**
A Virtual Private Network (VPN) is a service that creates a secure, encrypted "tunnel" between your device and the internet. It hides your IP address, shielding your online activity from ISPs, hackers on public Wi-Fi, and advertisers. It also enables bypassing geo-restrictions by making it appear you are in a different location.

**Results:**
```
OpenVPN
```

---

### Step 4: What tool do we use to test our connection to the target with an ICMP echo request?
**Status:** ✅ Success

**Description:**
A ping (or simply "ping") is a network diagnostic tool used to test connectivity between a source device and a target server. It sends Internet Control Message Protocol (ICMP) Echo Request packets to an IP address, measuring the round-trip time (latency) in milliseconds and identifying packet loss to verify if a server is online or troubleshooting network issues.

**Results:**
```
Ping
```

---

### Step 5: What is the name of the most common tool for finding open ports on a target?
**Status:** ✅ Success

**Description:**
Nmap ("Network Mapper") is an open source tool for network exploration and security auditing. It was designed to rapidly scan large networks, although it works fine against single hosts.

**Commands:**
```
nmap -sV -sC -T4 meow.htb
```

**Results:**
```
nmap
```

---

### Step 6: What service do we identify on port 23/tcp during our scans?
**Status:** ✅ Success

**Description:**


**Results:**
```
telnet
```

---

### Step 7: What username is able to log into the target over telnet with a blank password?
**Status:** ✅ Success

**Description:**


**Commands:**
```
telnet mew.htb
```

**Results:**
```
root
```

---

### Step 8: Submit root flag
**Status:** ✅ Success

**Description:**
Getting a flag on Hack The Box (HTB) is the primary goal of its "Capture The Flag" (CTF) style labs, where you exploit vulnerabilities to find a hidden string of text that acts as proof of completion.

**Commands:**
```
cat flag.txt
```

**Results:**
```
b40abdfe23665f766f9c61ecba8a4c19
```

---

