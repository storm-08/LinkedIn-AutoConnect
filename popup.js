
document.addEventListener("DOMContentLoaded", () => {
  let isConnecting = false;
  const toggleButton = document.getElementById("toggleButton");
  const connectionCounter = document.getElementById("counter");

  toggleButton.addEventListener("click", () => {
    isConnecting = !isConnecting;

    if (isConnecting) {
      // Change to Stop Connecting state
      toggleButton.textContent = "STOP CONNECTING";
      toggleButton.classList.remove("start-button");
      toggleButton.classList.add("stop-button");
      startConnecting();
    } else {
      // Change to Start Connecting state
      toggleButton.textContent = "START CONNECTING";
      toggleButton.classList.remove("stop-button");
      toggleButton.classList.add("start-button");
      stopConnecting();
    }
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'incrementCounter') {
      connectionCounter.textContent =  message.count;
    }
    if (message.type === 'connectionComplete') {
      // Reset button to "Start Connecting" when all profiles are done
      toggleButton.textContent = "START CONNECTING";
      toggleButton.classList.remove("stop-button");
      toggleButton.classList.add("start-button");
      isConnecting = false;
    }
  });
});

function startConnecting() {
  console.log("Starting to connect...");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func :  () =>{
              let shouldStopConnecting = false;
              const profiles = document.querySelectorAll(".reusable-search__result-container");
              let index = 0;
              let connectionSent = 0;
              chrome.runtime.onMessage.addListener((message) => {
                if (message.type === 'stopConnecting') {
                  shouldStopConnecting = true;
                }
              });
              function sendRequest() {
                if (shouldStopConnecting || index >= profiles.length) {
                  console.log("Finished sending connection requests.");
                  chrome.runtime.sendMessage({ type: 'connectionComplete' });
                  return;
                }
                const profile = profiles[index];
                const connectButton = profile.querySelector('button[aria-label*="Invite"]');
                const messageButton = profile.querySelector('button[aria-label*="Message"]');
            
                // Skip if "Message" button is found instead of "Connect"
                if (messageButton) {
                  console.log(`Skipping profile ${index + 1} (Message button found)`);
                  index++;
                  sendRequest(); // Continue to the next profile
                  return;
                }
            
                if (connectButton) {
                  console.log(`Sending connection request to profile ${index + 1}`);
                  connectButton.click();
            
                  // Close the "Add a note" popup if it appears
                  setTimeout(() => {
                    const sendButton = document.querySelector('button[aria-label="Send without a note"]');
                    if (sendButton) {
                      sendButton.click();
                      console.log(`Connection request sent to profile ${index + 1}`);
                      connectionSent++;
                      chrome.runtime.sendMessage({type : 'incrementCounter', count: connectionSent});
                    }
                  }, 1000);
                } else {
                  console.log(`No Connect button found for profile ${index + 1}`);
                }
            
                index++;
                const delay = 5000; // Delay of 5 seconds
                setTimeout(sendRequest, delay);
              }
              sendRequest();
            } 
            
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Script injection failed: " + chrome.runtime.lastError.message);
            }
          }
        );
      }
    });
}

function stopConnecting() {
  // Send a message to stop the connection process
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'stopConnecting' });
    }
  });
}



  

  