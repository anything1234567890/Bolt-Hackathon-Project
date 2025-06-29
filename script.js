// --- Day 3: Connecting the Brain to the Screen ---

const geminiApiKey = "YOUR_API_KEY_HERE";//KEY HAS BEEN INVALIDATED FOR SECURITY REASONS

// 1. Get references to our HTML elements from the page
const parkButton = document.getElementById("simulate-park");
const downtownButton = document.getElementById("simulate-downtown");
const suggestionBox = document.getElementById("suggestion-content");

// 2. Create "listeners" that wait for a button click
parkButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevents the page from jumping
    getAISuggestion("Central Park", "Saturday afternoon");
});

downtownButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevents the page from jumping
    getAISuggestion("Downtown City Center", "Weekday Lunchtime");
});

// 3. The main AI function, now modified to update the screen
async function getAISuggestion(destination, time) {
    console.log(`Asking Gemini about: ${destination}`);

    // Show the loader on the screen while we wait for the AI
    suggestionBox.innerHTML = `<div class="loader"></div>`; 

    
   const prompt = `You are the 'Next-Step' AI for the Bolt app. Follow these rules strictly:
1. If the destination is 'Central Park', your suggestion MUST be about Bolt Scooters.
2. If the destination is 'Downtown City Center', your suggestion MUST be about Bolt Food.

A user just arrived at "${destination}" at ${time}.

Based on the rules above, provide one useful next action. Your response must be only a valid JSON object with two keys: "suggestion_text" and "button_text".`;

  
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
            throw new Error("Invalid response from Gemini AI.");
        }

        const rawText = data.candidates[0].content.parts[0].text;

        const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const suggestion = JSON.parse(cleanedText);

        console.log("Gemini responded successfully!", suggestion);

        // 4. THIS IS THE MAGIC: Update the HTML with the AI's response
        suggestionBox.innerHTML = `
            <p class="suggestion-text">${suggestion.suggestion_text}</p>
            <button class="suggestion-btn">${suggestion.button_text}</button>
        `;

    } catch (error) {
        console.error("Error asking Gemini AI:", error);
        
        suggestionBox.innerHTML = `<p class="error-text">Oops! Something went wrong. Please try again.</p>`;
    }
}
