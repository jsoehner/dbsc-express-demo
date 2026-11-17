const $ = id => document.getElementById(id);

// --- Utility: Convert JWK to PEM ---
async function jwkToPem(jwk) {
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"]
    );
    const exported = await crypto.subtle.exportKey("spki", key);
    const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    const pem = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join('\\n')}\n-----END PUBLIC KEY-----`;
    return pem;
  } catch (e) {
    return "Error converting key: " + e.message;
  }
}

// --- Intercept Fetch to Log Client Activity ---
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  const method = (args[1] && args[1].method) || 'GET';
  
  const isCrypto = url.includes('/dbsc-bound/') || url.includes('/dbsc');
  
  // We log all fetch requests
  const time = new Date().toLocaleTimeString();
  let payloadStr = "";
  
  if (args[1] && args[1].body) {
    try {
      const bodyParsed = JSON.parse(args[1].body);
      
      // Recombine and show the JWK as PEM in the dedicated window
      if (bodyParsed.publicKey) {
        jwkToPem(bodyParsed.publicKey).then(pem => {
          const pemBox = $("pem-box");
          if (pemBox) {
            pemBox.innerHTML = `
              <div style="color:#38bdf8; margin-bottom: 8px; font-weight: bold;">Extracted via WebCrypto:</div>
              <div style="word-break: break-all;">${pem}</div>
            `;
          }
        });
      }
      
      payloadStr = JSON.stringify(bodyParsed, null, 2);
    } catch(e) {
        payloadStr = args[1].body;
    }
  }

  const logHtml = `
    <div class="log-entry">
      <span class="log-time">[${time}]</span> <span class="log-method">${method}</span> <span class="log-url">${url}</span>
      ${payloadStr ? `<div class="log-payload">${payloadStr}</div>` : ''}
    </div>
  `;
  
  const cryptoLogs = $("crypto-logs");
  const deviceLogs = $("device-logs");
  const targetPanel = isCrypto ? cryptoLogs : deviceLogs;
  
  if (targetPanel && targetPanel.innerHTML.includes("Waiting for")) {
    targetPanel.innerHTML = "";
  }
  if (targetPanel) {
    targetPanel.insertAdjacentHTML('afterbegin', logHtml);
  }

  // Trigger animation per-request
  const path = document.querySelector('.diagram-path');
  if (path) {
    const pkt = document.createElement('div');
    pkt.className = 'packet';
    path.appendChild(pkt);
    
    pkt.style.transition = 'none';
    pkt.style.left = '0';
    pkt.style.opacity = '1';
    pkt.style.background = '#3b82f6';
    pkt.style.boxShadow = '0 0 10px #3b82f6';
    
    void pkt.offsetWidth; // force reflow
    
    pkt.style.transition = 'left 0.4s ease-in, opacity 0.2s';
    pkt.style.left = 'calc(100% - 14px)';
    
    const responsePromise = originalFetch.apply(this, args);
    
    // Wait for both the network response AND the 450ms outgoing animation to finish
    Promise.all([
      responsePromise.catch(e => e), // catch so Promise.all doesn't fail fast
      new Promise(r => setTimeout(r, 450))
    ]).then(([resOrErr]) => {
      if (resOrErr instanceof Error) {
        pkt.style.background = '#ef4444';
        pkt.style.boxShadow = '0 0 10px #ef4444';
        pkt.style.opacity = '0';
        setTimeout(() => pkt.remove(), 200);
        return;
      }
      
      pkt.style.background = '#10b981';
      pkt.style.boxShadow = '0 0 10px #10b981';
      pkt.style.left = '0';
      setTimeout(() => {
        pkt.style.opacity = '0';
        setTimeout(() => pkt.remove(), 200);
      }, 400);
    });
    
    return responsePromise;
  }

  return originalFetch.apply(this, args);
};

// Save a reference to our intercepted fetch BEFORE the dbsc-toolkit loads and monkey-patches it
window.__myFetch = window.fetch;
