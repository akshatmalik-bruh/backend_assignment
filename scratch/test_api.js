
async function test() {
    const signupData = {
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "password123",
        role: "teacher"
    };

    console.log("Testing Signup...");
    const signupRes = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData)
    });
    const signupJson = await signupRes.json();
    console.log("Signup Response:", signupJson);

    if (signupRes.ok) {
        console.log("\nTesting Signin...");
        const signinRes = await fetch("http://localhost:3000/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: signupData.email,
                password: signupData.password
            })
        });
        const signinJson = await signinRes.json();
        console.log("Signin Response:", signinJson);

        if (signinRes.ok) {
            console.log("\nTesting Profile...");
            const profileRes = await fetch("http://localhost:3000/auth/profile", {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${signinJson.token}`
                }
            });
            const profileJson = await profileRes.json();
            console.log("Profile Response:", profileJson);
        }
    }
}

test().catch(console.error);
