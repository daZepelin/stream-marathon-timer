export const sendLog = async (type: "labs" | "elements", message: string) => {
    try {
        const url = `http://localhost:1425/log?type=${encodeURIComponent(
            type
        )}&msg=${encodeURIComponent(message)}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error("Failed to send log:", await response.text());
            return false;
        }

        return true;
    } catch (err) {
        console.error("Error sending log:", err);
        return false;
    }
};
