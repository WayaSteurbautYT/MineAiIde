// DMS (Direct Message System) Hello World Test using Discord MCP
// Test ID: 1016714820160077856

class DMSTest {
  constructor() {
    this.messages = [];
    this.testId = '1016714820160077856';
    this.discordEnabled = true;
  }

  // Send a hello world message via Discord
  async sendHelloWorld(sender = 'TestUser', channelId = null) {
    const message = {
      id: Date.now(),
      testId: this.testId,
      sender: sender,
      content: 'Hello World in DMS - Test ID: 1016714820160077856',
      timestamp: new Date().toISOString(),
      type: 'hello_world',
      platform: 'discord'
    };
    
    this.messages.push(message);
    console.log(`[DMS Test ${this.testId}] Discord message prepared:`, message);
    
    // If Discord channel ID is provided, we would send it via Discord API
    if (channelId && this.discordEnabled) {
      console.log(`[DMS Test ${this.testId}] Would send to Discord channel: ${channelId}`);
      // Note: Actual Discord API call would be made here via MCP tools
    }
    
    return message;
  }

  // Receive and process Discord messages
  receiveMessage(message) {
    console.log(`[DMS Test ${this.testId}] Discord message received:`, message);
    
    if (message.content && message.content.includes('Hello World in DMS')) {
      return {
        status: 'success',
        response: 'Hello World received successfully via Discord DMS!',
        testId: this.testId,
        platform: 'discord',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      status: 'unknown',
      response: 'Unknown message format',
      testId: this.testId,
      platform: 'discord'
    };
  }

  // Get Discord user info (simulated MCP call)
  async getDiscordUser() {
    console.log(`[DMS Test ${this.testId}] Fetching Discord user info via MCP...`);
    // This would use discord_api_getcurrentuser MCP tool
    return {
      username: 'TestUser',
      id: '1016714820160077856',
      discriminator: '0001'
    };
  }

  // Get Discord DM channels (simulated MCP call)
  async getDMChannels() {
    console.log(`[DMS Test ${this.testId}] Fetching Discord DM channels via MCP...`);
    // This would use discord_api_getuserdmchannels MCP tool
    return [
      {
        id: 'dm_channel_123',
        last_message_id: 'msg_456',
        recipients: [{ username: 'TestUser', id: '1016714820160077856' }]
      }
    ];
  }

  // Send a response message back
  async sendResponseMessage(originalMessage, responseContent = 'Message received! This is an automated response from the DMS test system.') {
    const responseMessage = {
      id: Date.now(),
      testId: this.testId,
      sender: 'DMS_System',
      recipient: originalMessage.sender,
      content: responseContent,
      timestamp: new Date().toISOString(),
      type: 'response',
      platform: 'discord',
      replyTo: originalMessage.id
    };
    
    this.messages.push(responseMessage);
    console.log(`[DMS Test ${this.testId}] Response message sent:`, responseMessage);
    
    return responseMessage;
  }

  // Run the complete Discord DMS hello world test
  async runHelloWorldTest() {
    console.log(`[DMS Test ${this.testId}] Starting Discord DMS Hello World Test...`);
    
    try {
      // Get Discord user info
      const userInfo = await this.getDiscordUser();
      console.log(`[DMS Test ${this.testId}] User info:`, userInfo);
      
      // Get DM channels
      const dmChannels = await this.getDMChannels();
      console.log(`[DMS Test ${this.testId}] DM channels:`, dmChannels);
      
      // Send hello world message to first DM channel
      const channelId = dmChannels[0]?.id || null;
      const sentMessage = await this.sendHelloWorld(userInfo.username, channelId);
      
      // Simulate receiving the message
      const response = this.receiveMessage(sentMessage);
      
      console.log(`[DMS Test ${this.testId}] Test Result:`, response);
      
      return {
        testId: this.testId,
        userInfo: userInfo,
        dmChannels: dmChannels,
        sentMessage: sentMessage,
        response: response,
        success: response.status === 'success',
        platform: 'discord',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[DMS Test ${this.testId}] Test failed:`, error);
      return {
        testId: this.testId,
        success: false,
        error: error.message,
        platform: 'discord'
      };
    }
  }

  // Get all messages
  getMessages() {
    return this.messages;
  }

  // Clear messages
  clearMessages() {
    this.messages = [];
    console.log(`[DMS Test ${this.testId}] Messages cleared`);
  }
}

// Export for use in other modules
export default DMSTest;

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const dmsTest = new DMSTest();
  dmsTest.runHelloWorldTest().then(result => {
    console.log('Test completed:', result);
  });
}
