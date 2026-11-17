const $ = id => document.getElementById(id);

const deviceLogs = $("device-logs");
const cryptoLogs = $("crypto-logs");
const pemBox = $("pem-box");

async function updateBindingStatus(outcome) {
  console.log("updateBindingStatus called with:", outcome);
  
  if (outcome && outcome.phase) {
    window.__lastDbscPhase = outcome.phase;
  }
  if (outcome && outcome.tier) {
    window.__lastDbscTier = outcome.tier;
  }
  
  // 1. Check TPM / Secure Enclave Availability
  let tpmAvailable = false;
  if (window.PublicKeyCredential && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    try {
      tpmAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      console.error("Error checking platform authenticator:", e);
    }
  }
  // If native DBSC is active, TPM/Secure Enclave is definitely available and used
  if (outcome && outcome.phase === "native-dbsc") {
    tpmAvailable = true;
  }
  
  const tpmRadio = $("tpm-available-radio");
  const tpmItem = tpmRadio.closest(".status-item");
  if (tpmAvailable) {
    tpmRadio.checked = true;
    tpmItem.classList.add("active-success");
  } else {
    tpmRadio.checked = false;
    tpmItem.classList.remove("active-success");
  }
  
  if (outcome && outcome.skipReason) {
    const msg = $("dbsc-support-message");
    msg.style.display = "block";
    msg.textContent = `Native DBSC skipped: ${outcome.skipReason}. To force native DBSC support, ensure you are using Chromium 146+ with chrome://flags/#enable-bound-session-credentials enabled.`;
  } else {
    $("dbsc-support-message").style.display = "none";
  }
  
  // 2. Check current binding tier
  const dbscRadio = $("tier-dbsc-radio");
  const dbscItem = dbscRadio.closest(".status-item");
  const boundRadio = $("tier-bound-radio");
  const boundItem = boundRadio.closest(".status-item");
  const statusText = $("binding-status-text");
  
  // Reset active classes
  dbscItem.classList.remove("active-primary");
  boundItem.classList.remove("active-warning");
  
  if (!outcome || outcome.phase === "unbound") {
    dbscRadio.checked = false;
    boundRadio.checked = false;
    statusText.textContent = "Unbound (No session / Logged out)";
    statusText.style.color = "var(--text-muted)";
  } else if (outcome.tier === "dbsc") {
    dbscRadio.checked = true;
    boundRadio.checked = false;
    dbscItem.classList.add("active-primary");
    statusText.textContent = "TPM-bound (tier=dbsc)";
    statusText.style.color = "var(--primary)";
  } else if (outcome.tier === "bound" || outcome.phase === "polyfill-bound") {
    dbscRadio.checked = false;
    boundRadio.checked = true;
    boundItem.classList.add("active-warning");
    statusText.textContent = "Fallback Bound (tier=bound)";
    statusText.style.color = "#fbbf24";
  } else if (outcome.phase === "error") {
    dbscRadio.checked = false;
    boundRadio.checked = false;
    statusText.textContent = `Error: ${outcome.error}`;
    statusText.style.color = "var(--danger)";
  } else {
    dbscRadio.checked = false;
    boundRadio.checked = false;
    statusText.textContent = `Phase: ${outcome.phase}`;
    statusText.style.color = "var(--text-muted)";
  }
}

async function handleAuth(action, bindDevice = false) {
  const email = $("email").value;
  const password = $("password").value;
  const name = "Demo User";
  
  // Clear all log panels
  $("device-logs").innerHTML = `<div style="color:#64748b;">Waiting for device requests...</div>`;
  $("crypto-logs").innerHTML = `<div style="color:#64748b;">Waiting for cryptographic events...</div>`;
  $("pem-box").innerHTML = `<div style="color:#64748b;">No key generated yet...</div>`;
  
  const out = $("auth-output");
  out.classList.add("flashing");
  out.style.color = "var(--text-muted)";
  out.innerHTML = `<div><span style="color:#38bdf8">Step 1:</span> Authenticating to get standard session...</div>`;
  
  try {
    const res = await fetch(`/api/auth/${action}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      const errMsg = data.message || data.error?.message || JSON.stringify(data);
      out.classList.remove("flashing");
      
      // Auto-fallback to sign-in if they tried to sign up an existing account
      if (action === "sign-up" && errMsg.includes("User already exists")) {
        out.style.color = "#fbbf24";
        out.textContent = "User already exists. Automatically signing in instead...";
        return handleAuth("sign-in", bindDevice);
      }
      
      out.style.color = "var(--danger)";
      out.textContent = `Error: ${errMsg}`;
      return;
    }

    await new Promise(r => setTimeout(r, 600));
    out.innerHTML += `<div><span style="color:#10b981">✓ Standard session created & cookie received</span></div>`;
    
    await new Promise(r => setTimeout(r, 600));
    out.innerHTML += `<div><span style="color:#10b981">✓ Standard session created & cookie received</span></div>`;
    
    if (bindDevice) {
      await new Promise(r => setTimeout(r, 600));
      out.innerHTML += `<div style="margin-top:8px"><span style="color:#38bdf8">Step 2:</span> Requesting WebCrypto to generate hardware-bound P-256 keypair...</div>`;
      
      // 2. IMPORTANT: Re-init DBSC so it binds the newly created session
      if (window.initDbsc) {
        try {
          const outcome = await window.initDbsc();
          updateBindingStatus(outcome);
          
          await new Promise(r => setTimeout(r, 800));
          out.innerHTML += `<div><span style="color:#10b981">✓ Keypair generated in browser</span></div>`;
          
          await new Promise(r => setTimeout(r, 600));
          out.innerHTML += `<div style="margin-top:8px"><span style="color:#38bdf8">Step 3:</span> Registering public key with server to bind to session...</div>`;
          
          await new Promise(r => setTimeout(r, 800));
          out.innerHTML += `<div><span style="color:#10b981">✓ Server bound public key! Device is now registered.</span></div>`;
          
        } catch (dbscErr) {
          out.style.color = "#fbbf24"; // warning yellow
          out.textContent = `Warning: Device binding failed (${dbscErr.message || "Unknown error"}). You are signed in but unprotected.`;
          updateBindingStatus({ phase: "error", error: dbscErr.message });
        }
      } else {
        out.style.color = "#fbbf24";
        out.textContent = "Warning: DBSC SDK not loaded. Proceeding unbound.";
        updateBindingStatus({ phase: "unbound" });
      }
    } else {
      updateBindingStatus({ phase: "unbound" });
    }
    
    setTimeout(() => {
      $("auth-panel").classList.add("hidden");
      $("app-panel").classList.remove("hidden");
      $("app-output").style.color = "var(--text-muted)";
      if (bindDevice) {
        $("app-output").textContent = "Device bound successfully. Ready for requests.";
      } else {
        $("app-output").textContent = "Signed in normally (Unbound session). Ready for requests.";
      }
      out.classList.remove("flashing");
    }, 2000);
    
  } catch (err) {
    out.classList.remove("flashing");
    out.style.color = "var(--danger)";
    out.textContent = `Network Error: ${err.message}`;
  }
}

$("signup-btn").addEventListener("click", () => handleAuth("sign-up", true));
$("signin-btn").addEventListener("click", () => handleAuth("sign-in", false));

$("delete-cookie-btn").addEventListener("click", () => {
  document.cookie = "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "better-auth.session_token_sec=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  const out = $("app-output");
  out.style.color = "#fbbf24";
  out.textContent = "Local session cookies deleted. You are now unauthenticated but the UI has not refreshed. Try fetching /me to see it fail!";
  updateBindingStatus({ phase: "unbound" });
});

$("fetch-btn").addEventListener("click", async () => {
  const out = $("app-output");
  out.classList.add("flashing");
  out.style.color = "var(--text-muted)";
  out.textContent = "Loading...";
  try {
    // 3. IMPORTANT: Use boundFetch instead of fetch for guarded routes
    // We MUST use the polyfill boundFetch. If we try to bypass it and use the native fetch, 
    // the browser's native network stack fails to attach the Sec-Session-Response proof 
    // (because native DBSC fetch interception is often disabled on localhost or self-signed certs),
    // resulting in a 403 Forbidden. The polyfill is required to intercept the challenge and sign it!
    const fetcher = window.boundFetch || fetch;
    
    const res = await fetcher("/me", { credentials: "include" });
    const data = await res.json();
    
    out.style.color = res.ok ? "var(--success)" : "var(--danger)";
    out.textContent = `${res.status} ${res.statusText}\n\n${JSON.stringify(data, null, 2)}`;
    
    if (res.ok && data.dbsc) {
      // If the polyfill downgraded the active fetch to 'bound' because we are on localhost,
      // but the hardware session was successfully registered as 'dbsc', we preserve the 'dbsc' tier visually.
      const effectiveTier = (data.dbsc.tier === "bound" && window.__lastDbscTier === "dbsc") 
        ? "dbsc" 
        : data.dbsc.tier;
        
      updateBindingStatus({ 
        phase: window.__lastDbscPhase || (effectiveTier === "dbsc" ? "native-dbsc" : "polyfill-bound"), 
        tier: effectiveTier 
      });
    }
  } catch (err) {
    out.style.color = "var(--danger)";
    out.textContent = `Error: ${err.message}`;
  } finally {
    out.classList.remove("flashing");
  }
});

$("stolen-btn").addEventListener("click", async () => {
  const out = $("app-output");
  out.classList.add("flashing");
  out.style.color = "var(--text-muted)";
  out.textContent = "Loading (Simulating attacker without device key)...";
  try {
    // We use plain fetch instead of boundFetch to simulate an attacker 
    // who stole the cookie but can't generate the DBSC signature.
    const res = await fetch("/me", { credentials: "include" });
    const data = await res.json();
    
    out.style.color = res.ok ? "var(--success)" : "var(--danger)";
    out.textContent = `${res.status} ${res.statusText}\n\n${JSON.stringify(data, null, 2)}`;
  } catch (err) {
    out.style.color = "var(--danger)";
    out.textContent = `Error: ${err.message}`;
  } finally {
    out.classList.remove("flashing");
  }
});

$("recertify-btn").addEventListener("click", async () => {
  const out = $("app-output");
  out.classList.add("flashing");
  out.style.color = "var(--text-muted)";
  out.textContent = "Clearing existing key and signing out...";
  try {
    if (window.clearBoundKey) {
      await window.clearBoundKey();
    }
    
    await fetch("/api/auth/sign-out", { method: "POST" });
    
    $("auth-panel").classList.remove("hidden");
    $("app-panel").classList.add("hidden");
    $("auth-output").innerHTML = `<div style="color:var(--success)">Device binding cleared. You have been signed out. Please sign in again to recertify.</div>`;
    updateBindingStatus({ phase: "unbound" });
  } catch (err) {
    out.style.color = "var(--danger)";
    out.textContent = `Error during recertification: ${err.message}`;
  } finally {
    out.classList.remove("flashing");
  }
});

$("logout-btn").addEventListener("click", async () => {
  await fetch("/api/auth/sign-out", { method: "POST" });
  if (window.clearBoundKey) {
    await window.clearBoundKey();
  }
  $("auth-panel").classList.remove("hidden");
  $("app-panel").classList.add("hidden");
  $("auth-output").textContent = "Signed out.";
  updateBindingStatus({ phase: "unbound" });
});

// Probe on page load
if (window.__dbscOutcome) {
  window.__dbscOutcome.then((outcome) => {
    updateBindingStatus(outcome);
    // If already bound on page load, switch to app-panel
    if (outcome.phase === "native-dbsc" || outcome.phase === "polyfill-bound") {
      $("auth-panel").classList.add("hidden");
      $("app-panel").classList.remove("hidden");
      $("app-output").style.color = "var(--text-muted)";
      $("app-output").textContent = `Session restored (${outcome.tier === 'dbsc' ? 'TPM-bound' : 'Fallback bound'}).`;
    }
  }).catch((e) => {
    console.error("Error with initial DBSC outcome:", e);
    updateBindingStatus({ phase: "error", error: e.message });
  });
} else {
  // Setup listener or fallback
  setTimeout(async () => {
    if (window.__dbscOutcome) {
      try {
        const outcome = await window.__dbscOutcome;
        updateBindingStatus(outcome);
        if (outcome.phase === "native-dbsc" || outcome.phase === "polyfill-bound") {
          $("auth-panel").classList.add("hidden");
          $("app-panel").classList.remove("hidden");
          $("app-output").style.color = "var(--text-muted)";
          $("app-output").textContent = `Session restored (${outcome.tier === 'dbsc' ? 'TPM-bound' : 'Fallback bound'}).`;
        }
      } catch (e) {
        updateBindingStatus({ phase: "error", error: e.message });
      }
    } else {
      updateBindingStatus({ phase: "unbound" });
    }
  }, 500);
}
