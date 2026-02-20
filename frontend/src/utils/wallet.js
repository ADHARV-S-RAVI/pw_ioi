import { PeraWalletConnect } from "@perawallet/connect";

export const peraWallet = new PeraWalletConnect();

export const connectWallet = async () => {
    try {
        const newAccounts = await peraWallet.connect();

        // Setup disconnect listener
        peraWallet.connector?.on("disconnect", () => {
            window.location.reload();
        });

        return newAccounts[0]; // Return the first account
    } catch (error) {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
            console.error("Wallet connection failed:", error);
        }
        return null;
    }
};

export const reconnectWallet = async () => {
    try {
        const accounts = await peraWallet.reconnectSession();

        if (accounts.length > 0) {
            peraWallet.connector?.on("disconnect", () => {
                window.location.reload();
            });
            return accounts[0];
        }
        return null;
    } catch (error) {
        console.error("Session reconnection failed:", error);
        return null;
    }
};

export const disconnectWallet = async () => {
    await peraWallet.disconnect();
    return null;
};
