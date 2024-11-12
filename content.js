function sendConnectionRequests() {
  console.log("Executing the logic.....")
    const profiles = document.querySelectorAll(".reusable-search__result-container");
  
    let index = 0;
  
    function sendRequest() {
      if (index >= profiles.length) {
        console.log("Finished sending connection requests.");
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
          }
        }, 1000);
      } else {
        console.log(`No Connect button found for profile ${index + 1}`);
      }
  
      index++;
      const delay = 5000; // Random delay between 5 and 10 seconds
      setTimeout(sendRequest, delay);
    }
  
    sendRequest();
  }
  
  console.log("Content file injected.");
  sendConnectionRequests();
  
  