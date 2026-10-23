
/* =========================================
   COSMIC HEADER — ONE-TIME OPEN
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const toggleButton = document.getElementById("planetaryToggle");

    if (!header || !toggleButton) return;

    toggleButton.addEventListener("click", () => {

        // Prevent the button from being used more than once.
        if (header.classList.contains("is-expanded")) return;

        // Open the header.
        header.classList.add("is-expanded");

        // Update accessibility state.
        toggleButton.setAttribute("aria-expanded", "true");

        // Play the opening animation, then remove the button.
        toggleButton.disabled = true;

        toggleButton.style.pointerEvents = "none";
        toggleButton.style.opacity = "0";
        toggleButton.style.transform = "translate(-50%, 20px)";
        toggleButton.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        // Remove the button after its fade-out animation.
        window.setTimeout(() => {
            toggleButton.remove();
        }, 550);

        // Bring the expanded header into view.
        header.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});



/* =========================================
   PLANETARY STAGE — COSMIC STARFIELD
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const stage = document.getElementById("planetaryStage");

    if (!stage || stage.querySelector(".planetary-cosmic-layer")) {
        return;
    }

    const starfield = document.createElement("div");

    starfield.className = "planetary-cosmic-layer";
    starfield.setAttribute("aria-hidden", "true");

    const starCount = window.matchMedia(
        "(max-width: 600px)"
    ).matches ? 18 : 36;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("span");

        star.className = "planetary-star";

        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * -6;

        star.style.left = `${Math.random() * 96 + 2}%`;
        star.style.top = `${Math.random() * 90 + 5}%`;

        star.style.setProperty("--star-size", `${size}px`);
        star.style.setProperty("--star-duration", `${duration}s`);
        star.style.setProperty("--star-delay", `${delay}s`);

        fragment.appendChild(star);
    }

    starfield.appendChild(fragment);
    stage.appendChild(starfield);
});

/* ==========================================
   SPACE MISSION CONTROLLER
   Rocket → Ignition → Takeoff → Info Panel
   ========================================== */

(() => {
    "use strict";

    const rocket = document.querySelector(".hero-planetary-rocket");
    const scene = document.querySelector(".hero-planetary-scene");
    const visual = rocket?.closest(".hero-visual") || scene;

    if (!rocket || !scene || !visual) {
        console.warn(
            "Space Mission: rocket, scene, or visual element was not found."
        );
        return;
    }

    // Prevent duplicate initialization.
    if (rocket.dataset.missionInitialized === "true") return;
    rocket.dataset.missionInitialized = "true";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let missionRunning = false;
    let launchTimer = null;
    let panelTimer = null;

    // Make the existing rocket keyboard accessible.
    rocket.setAttribute("role", "button");
    rocket.setAttribute("tabindex", "0");
    rocket.setAttribute("aria-label", "Launch the space rocket");
    rocket.setAttribute("aria-controls", "space-mission-panel");
    rocket.setAttribute("aria-expanded", "false");

    // Create the engine flame.
    const flame = document.createElement("div");
    flame.className = "rocket-engine-flame";
    flame.setAttribute("aria-hidden", "true");
    scene.appendChild(flame);

    // Create the launch glow.
    const glow = document.createElement("div");
    glow.className = "rocket-launch-glow";
    glow.setAttribute("aria-hidden", "true");
    scene.appendChild(glow);

    // Create a small launch status message.
    const status = document.createElement("div");
    status.className = "rocket-launch-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = "ENGINE IGNITION...";
    scene.appendChild(status);

    // Build the mission information panel.
    const panel = document.createElement("section");
    panel.className = "space-mission-panel";
    panel.id = "space-mission-panel";
    panel.setAttribute("aria-labelledby", "mission-panel-title");
    panel.setAttribute("aria-hidden", "true");

    panel.innerHTML = `
        <span class="mission-eyebrow">Mission Control / 001</span>

        <h2 class="mission-title" id="mission-panel-title">
            Beyond The Stars
        </h2>

        <p class="mission-description">
            The launch is complete. Your journey into the solar system
            begins here. Explore distant worlds, discover new horizons,
            and unlock the mysteries of space.
        </p>

        <div class="mission-data">
            <div class="mission-data-item">
                <span>MISSION STATUS</span>
                <strong>Launched</strong>
            </div>

            <div class="mission-data-item">
                <span>DESTINATION</span>
                <strong>Deep Space</strong>
            </div>

            <div class="mission-data-item">
                <span>PROPULSION</span>
                <strong>Active</strong>
            </div>

            <div class="mission-data-item">
                <span>MISSION ID</span>
                <strong>ORBIT-001</strong>
            </div>
        </div>

        <button class="mission-reset-button" type="button">
            <span aria-hidden="true">↻</span>
            Reset Mission
        </button>
    `;

    visual.appendChild(panel);

    const resetButton = panel.querySelector(".mission-reset-button");

    // Connect the power button to the existing launch sequence.
    const powerButton = document.getElementById("rocketLaunchButton");

    if (powerButton) {
        powerButton.addEventListener("click", launchRocket);
    }

    // Start the launch sequence.
    function launchRocket() {
        if (missionRunning) return;

        missionRunning = true;

        clearTimeout(launchTimer);
        clearTimeout(panelTimer);

        rocket.setAttribute("aria-expanded", "false");
        rocket.setAttribute("aria-disabled", "true");

        panel.classList.remove("is-visible");
        panel.setAttribute("aria-hidden", "true");

        status.textContent = "ENGINE IGNITION...";
        status.classList.add("is-visible");

        // Light the engine and show the launch glow.
        flame.classList.add("is-active");
        glow.classList.remove("is-active");

        // Restart the glow animation reliably.
        void glow.offsetWidth;
        glow.classList.add("is-active");

        // Start the rocket's takeoff after ignition.
        launchTimer = window.setTimeout(() => {
            status.textContent = "LIFTOFF — ENTERING DEEP SPACE";
            rocket.classList.add("is-launching");
        }, reducedMotion.matches ? 50 : 550);

        // Open the information panel after the rocket leaves.
        panelTimer = window.setTimeout(() => {
            flame.classList.remove("is-active");
            status.classList.remove("is-visible");

            panel.classList.add("is-visible");
            panel.setAttribute("aria-hidden", "false");
            rocket.setAttribute("aria-expanded", "true");

            resetButton.focus({ preventScroll: true });
        }, reducedMotion.matches ? 150 : 2400);
    }

    // Reset the rocket and make the interaction repeatable.
    function resetMission() {
        clearTimeout(launchTimer);
        clearTimeout(panelTimer);

        panel.classList.remove("is-visible");
        panel.setAttribute("aria-hidden", "true");

        flame.classList.remove("is-active");
        glow.classList.remove("is-active");
        status.classList.remove("is-visible");

        rocket.classList.remove("is-launching");
        rocket.removeAttribute("aria-disabled");
        rocket.setAttribute("aria-expanded", "false");

        // Force the browser to apply the reset before the next launch.
        void rocket.offsetWidth;

        missionRunning = false;
        rocket.focus({ preventScroll: true });
    }

    // Mouse and touch interaction.
    rocket.addEventListener("click", launchRocket);

    // Keyboard interaction: Enter or Space.
    rocket.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            // Space normally produces a click on buttons. Prevent duplicates.
            if (event.repeat) return;

            launchRocket();
        }
    });

    resetButton.addEventListener("click", resetMission);

    console.info("Space Mission initialized successfully.");
})();
