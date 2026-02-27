#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Push Notification Test Script
# ──────────────────────────────────────────────────────────────
# Usage (IMPORTANT: wrap token in quotes to avoid zsh glob errors):
#   ./scripts/test-push.sh "ExponentPushToken[YOUR_TOKEN]"
#
# Example:
#   ./scripts/test-push.sh "ExponentPushToken[V-_IQTDz_47HBgvbK0tn1E]"
#
# The token is shown when you tap the 🔔 bell icon in the app
# (must be a production build — APK/IPA, NOT Expo Go)
# ──────────────────────────────────────────────────────────────

TOKEN="${1:?Usage: $0 <ExponentPushToken[...]>}"

echo "📤 Sending test push notification to: $TOKEN"

curl -s -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$TOKEN\",
    \"sound\": \"default\",
    \"title\": \"🏥 HealPath Test\",
    \"body\": \"Push notifications are working! 🎉\",
    \"data\": { \"type\": \"test\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\" }
  }" | python3 -m json.tool 2>/dev/null || echo "(raw response above)"

echo ""
echo "✅ Done! Check your device for the notification."
