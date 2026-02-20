🔷 Project Title
Token-Based Event Ticketing System on Algorand

🔷 Problem Statement
Traditional ticketing systems are vulnerable to fraud, duplication, and lack transparent ownership tracking.

This project introduces a blockchain-based ticketing system using Algorand NFTs (ASA) that ensures:

✔ Authentic ticket ownership
✔ Secure transfers
✔ Instant verification at entry points

🔷 Live Demo
Frontend URL:


🔷 Demo Video (LinkedIn)


🔷 Algorand Deployment
App ID (Testnet): XXXXXX

Testnet Explorer Link:
https://testnet.algoexplorer.io/application/XXXXXX

🔷 Architecture Overview
The system integrates a React frontend with an Algorand smart contract to manage event tickets as blockchain assets.

Flow:

Event Creation
→ Ticket Minted as ASA
→ User Purchases Ticket
→ Ownership Stored On-Chain
→ Ticket Verified via Wallet Ownership

Frontend communicates with the deployed smart contract to handle minting, transfers, and ownership verification.

🔷 Tech Stack
Blockchain: Algorand Testnet

Smart Contract: Beaker (Python)

Assets: Algorand Standard Assets (ASA)

Frontend: React

Toolkit: AlgoKit

Wallet Integration: Pera Wallet

🔷 Installation & Setup
git clone <repo-link>
cd project-folder
algokit localnet start
cd frontend
npm install
npm run dev
🔷 Usage Guide
Organizer creates an event

Tickets are minted as NFTs

User connects wallet

User purchases ticket

Ticket ownership is stored on-chain

Ticket is verified using ownership check
