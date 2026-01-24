# MineAI IDE - Makefile for WayaCreate Agent and Web IDE
# Uses Make MCP tool integration for automated workflows

.PHONY: help setup agent web-ide deploy clean test scrape-transcripts train-agent

# Default target
help:
	@echo "MineAI IDE - WayaCreate Agent Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  setup          - Initialize project dependencies"
	@echo "  agent          - Build WayaCreate AI agent"
	@echo "  web-ide        - Build web-based Minecraft AI IDE"
	@echo "  deploy         - Deploy to Vercel"
	@echo "  test           - Run all tests"
	@echo "  scrape-transcripts - Scrape WayaCreate YouTube transcripts"
	@echo "  train-agent    - Train agent on scraped data"
	@echo "  clean          - Clean build artifacts"

# Setup project dependencies
setup:
	@echo "Setting up MineAI IDE project..."
	npm install
	cd web-ide && npm install
	mkdir -p data/transcripts
	mkdir -p data/models
	mkdir -p data/projects
	@echo "Setup complete!"

# Build WayaCreate AI agent
agent: scrape-transcripts train-agent
	@echo "Building WayaCreate AI Agent..."
	node src/main/agents/build-agent.js
	@echo "Agent built successfully!"

# Scrape WayaCreate YouTube transcripts
scrape-transcripts:
	@echo "Scraping WayaCreate YouTube transcripts..."
	node -e "
const fs = require('fs').promises;
const path = require('path');

// WayaCreate channel videos (example list)
const videos = [
	'https://youtu.be/5g6rSyDYbu8?si=ba_gA1Ku8b1ZjzO7',
	'https://youtu.be/example1', // Add more video URLs
	'https://youtu.be/example2'
];

async function scrapeAllTranscripts() {
	const transcriptTool = require('./src/main/youtube-transcript-test.js');
	const YouTubeTranscriptTest = transcriptTool.default;
	const test = new YouTubeTranscriptTest();
	
	const allTranscripts = [];
	
	for (const video of videos) {
		try {
			console.log('Processing:', video);
			test.videoUrl = video;
			const result = await test.runTranscriptTest();
			if (result.success) {
				allTranscripts.push({
					url: video,
					transcript: result.transcriptData,
					timestamp: new Date().toISOString()
				});
			}
		} catch (error) {
			console.error('Error processing video:', video, error.message);
		}
	}
	
	// Save transcripts
	await fs.writeFile(
		'data/transcripts/wayacreate-transcripts.json',
		JSON.stringify(allTranscripts, null, 2)
	);
	
	console.log('Scraped', allTranscripts.length, 'transcripts');
}

scrapeAllTranscripts().catch(console.error);
"
	@echo "Transcripts scraped and saved to data/transcripts/"

# Train agent on scraped data
train-agent:
	@echo "Training WayaCreate agent on transcripts..."
	node -e "
const fs = require('fs').promises;

async function trainAgent() {
	try {
		const transcripts = JSON.parse(
			await fs.readFile('data/transcripts/wayacreate-transcripts.json', 'utf8')
		);
		
		// Create training data
		const trainingData = transcripts.map(item => ({
			input: item.transcript.transcript.map(t => t.text).join(' '),
			output: 'WayaCreate expertise response based on transcript content',
			metadata: {
				url: item.url,
				timestamp: item.timestamp,
				videoTitle: item.transcript.title
			}
		}));
		
		// Save training data
		await fs.writeFile(
			'data/models/wayacreate-training-data.json',
			JSON.stringify(trainingData, null, 2)
		);
		
		console.log('Training data created with', trainingData.length, 'samples');
	} catch (error) {
		console.error('Training error:', error.message);
	}
}

trainAgent();
"
	@echo "Agent training data prepared!"

# Build web-based IDE
web-ide:
	@echo "Building web-based Minecraft AI IDE..."
	@echo "Creating React frontend with Vercel deployment..."
	mkdir -p web-ide/src/components
	mkdir -p web-ide/src/pages
	mkdir -p web-ide/src/services
	mkdir -p web-ide/api
	@echo "Web IDE structure created!"

# Deploy to Vercel
deploy: web-ide
	@echo "Deploying to Vercel..."
	cd web-ide && vercel --prod
	@echo "Deployment complete!"

# Run tests
test:
	@echo "Running MineAI IDE tests..."
	npm test
	cd web-ide && npm test
	@echo "All tests completed!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf node_modules/.cache
	rm -rf web-ide/dist
	rm -rf web-ide/.next
	rm -rf data/temp
	@echo "Clean complete!"
