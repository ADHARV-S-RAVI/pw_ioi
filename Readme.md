# 🎟️ Token-Based Event Ticketing on Algorand

A decentralized event ticketing platform built on the **Algorand Blockchain**, leveraging **Algorand Standard Assets (ASA)** to eliminate fraud and provide transparent ticket ownership.

---

## 💡 The Problem
Traditional ticketing systems are plagued by:
* **Ticket Fraud:** Duplicate or counterfeit tickets that are hard to verify off-chain.
* **Price Gouging:** Unregulated secondary markets where fans are exploited by scalpers.
* **Opacity:** A total lack of transparency in ownership history and provenance.

## 🚀 Our Solution
By utilizing Algorand’s high-speed, low-cost blockchain with **instant finality**, we ensure:
* **Immutable Authenticity:** Every ticket is a unique NFT (ASA) minted on the ledger.
* **Transparent Ownership:** A clear, public history of every ticket transfer.
* **Instant Verification:** Seamless check-in using cryptographic ownership proof via Pera Wallet.

---

## 🔗 Project Links
* **Live Demo:**  -https://algoTix.vercel.app/ 
* **Demo Video:** (https://www.linkedin.com/posts/adharv-s-ravi_pw-institute-of-innovation-activity-7430438165083115520-_74B?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE9UOCgBhJzup4a8aqvA9lwdBPxmk5Aqj_shttps://www.linkedin.com/posts/adharv-s-ravi_pw-institute-of-innovation-activity-7430438165083115520-_74B?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE9UOCgBhJzup4a8aqvA9lwdBPxmk5Aqj_s)
* **Testnet App ID:** `755803513`
* **Ticket ASA(NFT):** `755803558`
* **Explorer:** [View on AlgoExplorer]([https://testnet.algoexplorer.io/](https://testnet.algoscan.app/app/755803513))

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Blockchain** | Algorand (Testnet) |
| **Smart Contracts** | Beaker (Python-based framework) |
| **Token Standard** | Algorand Standard Assets (ASA) |
| **Frontend** | React.js |
| **Wallet Integration** | Pera Wallet |
| **Development Kit** | AlgoKit |

---

## 🏗️ Architecture Overview

The system bridges a modern React frontend with the Algorand blockchain via the Beaker framework.

1.  **Frontend (React):** User interface for browsing events and managing tickets.
2.  **Wallet (Pera):** Handles secure transaction signing and asset storage.
3.  **Smart Contract (Beaker):** Manages the logic for event creation, ticket minting, and purchasing.
4.  **Ledger (Algorand):** Stores ASA data and verifies ownership during check-in.

### User Flow
**Event Creation** ➔ **ASA Ticket Minting** ➔ **Wallet Purchase** ➔ **Ownership Storage** ➔ **Entry Verification**

---

## ⚙️ Installation & Setup

### Prerequisites
* [AlgoKit](https://github.com/algorand/algokit-cli)
* Node.js (v16+)
* Docker (for LocalNet)

### Step-by-Step

1.  **Clone the repository**
    ```bash
    git clone <repo-link>
    cd project-folder
    ```

2.  **Start the Local Algorand Network**
    ```bash
    algokit localnet start
    ```

3.  **Setup the Smart Contract**
    ```bash
    cd backend
    pip install -r requirements.txt
    python deploy.py
    ```

4.  **Launch the Frontend**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 📖 Usage Guide
* **Organizers:** Connect your wallet to the dashboard to "Create Event." This triggers an atomic transaction to mint ticket NFTs.
* **Attendees:** Connect Pera Wallet, browse available events, and purchase tickets directly from the contract.
* **Check-in:** At the venue, the app verifies the presence of the specific ASA in the user's wallet for instant entry.
<img width="1919" height="951" alt="Screenshot 2026-02-20 055045" src="https://github.com/user-attachments/assets/db537c6b-ab8f-4a0d-afa5-08754620e5a0" />
<img width="1918" height="896" alt="Screenshot 2026-02-20 054913" src="https://github.com/user-attachments/assets/eb6442c8-91cf-44f6-8c0f-eb6fecf599d9" />

<img width="1919" height="966" alt="Screenshot 2026-02-20 054854" src="https://github.com/user-attachments/assets/bc6d0e60-61c5-41e5-b443-7550c6c2e5a0" />

---

## ⚠️ Known Limitations
* **Resale Logic:** Currently optimized for primary sales; secondary market royalty logic is in the roadmap.
* **Mobile Scanning:** Prototype relies on manual wallet address verification; a dedicated QR scanner integration is planned.
* **Scale:** Current build is optimized for Testnet performance and demonstration purposes.

---

## 👥 Team Members & Roles
| Name | Role | Responsibility |
| :--- | :--- | :--- |
| **Adwaith C Warrier** | Lead Developer | Smart Contract Architecture (Beaker/PyTeal) |
| **Adharv S Ravi** | Backend Engineer | Purchase Logic & Asset Management |
| **Sagar S S** | Frontend Developer | UI/UX & Verification Logic |
| **Abhinav Kumar** | DevOps / Integration | Deployment, Pera Wallet Integration & Testing |

---

## 📄 License
This project is licensed under the MIT License - see the `LICENSE` file for details.








