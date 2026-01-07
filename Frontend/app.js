// Ensure DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const cacheDiv = document.getElementById("cache");
    const putBtn = document.getElementById("putBtn");
    const getBtn = document.getElementById("getBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    let cacheSet = false;

    putBtn.disabled = true;
    getBtn.disabled = true;
    deleteBtn.disabled = true;

    // -----------------------
    // Render cache
    function renderCache(state) {
        cacheDiv.innerHTML = "";
        if (!state) return;
        state.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "cache-item";
            div.innerText = `${item.key}:${item.value}`;

            cacheDiv.appendChild(div);

            if (index < state.length - 1) {
                const arrow = document.createElement("span");
                arrow.innerText = "→";
                arrow.className = "arrow";
                cacheDiv.appendChild(arrow);
            }
        });
    }

    // -----------------------
    // Set Capacity
    document.getElementById("setCapacityBtn").addEventListener("click", async () => {
        const cap = Number(document.getElementById("capacity").value);
        if (!cap || cap <= 0) return alert("Enter valid capacity");

        try {
            const res = await fetch("/setCapacity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ capacity: cap })
            });
            const data = await res.json();
            output.innerText = data.message;
            cacheSet = true;

            putBtn.disabled = false;
            getBtn.disabled = false;
            deleteBtn.disabled = false;

            renderCache([]);
        } catch (err) {
            output.innerText = "Error setting capacity";
            console.error(err);
        }
    });

    // PUT / Insert
    putBtn.addEventListener("click", async () => {
        if (!cacheSet) return alert("Set cache capacity first");

        const key = Number(document.getElementById("key").value);
        const value = Number(document.getElementById("value").value);
        if (isNaN(key) || isNaN(value)) return alert("Enter valid key and value");

        try {
            const res = await fetch("/put", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value })
            });
            const data = await res.json();
            output.innerText = data.message;
            renderCache(data.cache);
        } catch (err) {
            output.innerText = "Error inserting key";
            console.error(err);
        }
    });

    // GET
    getBtn.addEventListener("click", async () => {
        if (!cacheSet) return alert("Set cache capacity first");

        const key = Number(document.getElementById("key").value);
        if (isNaN(key)) return alert("Enter valid key");

        try {
            const res = await fetch(`/get/${key}`);
            const data = await res.json();
            output.innerText = data.value === -1 ? `GET ${key} → Not Found` : `GET ${key} → ${data.value}`;
            renderCache(data.cache);
        } catch (err) {
            output.innerText = "Error getting key";
            console.error(err);
        }
    });

    // DELETE
    deleteBtn.addEventListener("click", async () => {
        if (!cacheSet) return alert("Set cache capacity first");

        const key = Number(document.getElementById("key").value);
        if (isNaN(key)) return alert("Enter valid key");

        try {
            const res = await fetch(`/delete/${key}`, { method: "DELETE" });
            const data = await res.json();
            output.innerText = data.error || data.message;
            renderCache(data.cache || []);
        } catch (err) {
            output.innerText = "Error deleting key";
            console.error(err);
        }
    });
});
