# 🎨 Midjourney Monster Generator Setup

Automated generation of D&D monster images using useapi.net + Midjourney API.

## 📋 Prerequisites

### 1. Midjourney Subscription
- Sign up at [midjourney.com](https://midjourney.com)
- Get **Basic plan** ($10/month) minimum
- Note your Discord username

### 2. useapi.net Account
- Sign up at [useapi.net](https://useapi.net)
- Add credits to your account (pay-per-use)
- Get your **API key** from dashboard

### 3. Connect Accounts
- Follow useapi.net's guide to connect your Midjourney account
- This usually involves adding their bot to your Discord

## 🚀 Setup Instructions

### Step 1: Configure API Key
1. Open `monster-generator.js`
2. Replace `YOUR_USEAPI_NET_API_KEY` with your actual API key:
   ```javascript
   API_KEY: 'your-actual-api-key-here'
   ```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Test with Sample Monsters (Recommended)
The script is pre-configured with 10 test monsters. Run:
```bash
npm start
```

### Step 4: Generate All 334 Monsters
To generate all monsters, modify the `MONSTERS` array in `monster-generator.js`:

```javascript
// Replace the test monsters with full list
const MONSTERS = require('./full-monster-list.json');
```

## 📊 Cost Estimation

### useapi.net Pricing (Approximate)
- **Cost per image**: ~$0.50-1.00
- **334 monsters**: ~$167-334
- **Plus Midjourney subscription**: $10/month

### Alternative: Direct Midjourney (Cheaper)
- **Midjourney Basic**: $10/month
- **334 images**: Fits in relaxed mode
- **Total cost**: ~$10-20

## ⚙️ Configuration Options

### Modify Generation Settings
In `monster-generator.js`, you can adjust:

```javascript
const CONFIG = {
    DELAY_BETWEEN_REQUESTS: 30000,  // 30 seconds (be respectful)
    MAX_RETRIES: 3,                 // Retry failed generations
    OUTPUT_DIR: './monster-images'   // Where to save images
};
```

### Customize Prompts
Modify the `createPrompt()` function:

```javascript
function createPrompt(monster) {
    return `Fantasy D&D ${monster.name}, dark fantasy card art style, detailed portrait showing head and upper body, dramatic lighting, menacing expression, high quality digital art --ar 1:1 --style raw`;
}
```

## 🎯 Usage

### Generate Sample (10 monsters)
```bash
npm start
```

### Monitor Progress
The script will show:
- ✅ Successful generations
- ❌ Failed attempts with retries
- 📊 Final summary

### Output
Images saved as:
- `monster-images/aboleth.png`
- `monster-images/adult-black-dragon.png`
- etc.

## 🔧 Troubleshooting

### API Key Issues
- Double-check your API key in the script
- Ensure you have credits in your useapi.net account
- Verify your Midjourney account is connected

### Rate Limiting
- Script includes 30-second delays between requests
- Don't reduce delays too much (risk of being rate limited)

### Failed Generations
- Script automatically retries failed generations
- Check console output for specific error messages
- Some monsters might need prompt adjustments

### Image Quality
- Modify the prompt for better results
- Add style parameters: `--style raw`, `--quality 2`
- Experiment with different aspect ratios

## 📈 Scaling Up

### For All 334 Monsters
1. Update the MONSTERS array to use `full-monster-list.json`
2. Run overnight (will take ~3-4 hours with delays)
3. Monitor for any failed generations

### Adding Magic Items Later
- Use similar approach for 362 magic items
- Modify prompts for item-specific generation
- Save to `magic-item-images/` folder

## 💡 Tips

1. **Start small**: Test with 5-10 monsters first
2. **Monitor costs**: Check your useapi.net usage regularly  
3. **Backup images**: Keep generated images safe
4. **Customize prompts**: Adjust for better art style consistency
5. **Rate limiting**: Be respectful of API limits

## 🆘 Support

- useapi.net documentation: [useapi.net/docs](https://useapi.net/docs)
- Midjourney help: Discord server
- Script issues: Check console output for errors

---

**Ready to generate 334 amazing monster images? Let's go!** 🐉⚔️