#!/bin/zsh
set -e
EMAIL="test_all_in_one_$(date +%s)@example.com"
PASSWORD="Password123!"
echo "1. Signing up $EMAIL..."
RES=$(curl -s -X POST https://backend-383t.onrender.com/v1/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo $RES | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")

echo "2. Fetching category..."
CAT_ID=$(curl -s https://backend-383t.onrender.com/v1/public/categories | python3 -c "import sys, json; d=json.load(sys.stdin); items=d['data'] if isinstance(d['data'], list) else d['data']['items']; print(items[0]['id'])")

echo "3. Sending all-in-one onboarding payload..."
curl -s -X PATCH https://backend-383t.onrender.com/v1/onboarding/me -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"step_id\":\"account_type\",\"data\":{\"account_type\":\"business\",\"first_name\":\"Test\",\"last_name\":\"User\",\"phone\":\"+1234567890\",\"name\":\"Trendy Studio\",\"website\":\"https://test.com\",\"primary_category_id\":\"$CAT_ID\",\"related_category_ids\":[],\"location\":{\"label\":\"Main branch\",\"address_line_1\":\"42 MG Road\",\"city\":\"Ahmedabad\",\"state\":\"Gujarat\",\"postal_code\":\"380001\",\"country_code\":\"IN\",\"latitude\":\"23.0225\",\"longitude\":\"72.5714\"},\"operating_hours\":[{\"day_of_week\":0,\"is_closed\":false,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"},{\"day_of_week\":1,\"is_closed\":false,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"},{\"day_of_week\":2,\"is_closed":false,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"},{\"day_of_week\":3,\"is_closed\":false,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"},{\"day_of_week\":4,\"is_closed\":false,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"},{\"day_of_week\":5,\"is_closed\":false,\"opens_at\":\"10:00\",\"closes_at\":\"16:00\"},{\"day_of_week\":6,\"is_closed\":true,\"opens_at\":\"09:00\",\"closes_at\":\"18:00\"}]}}" | python3 -c "import sys, json; res=json.load(sys.stdin); print('All-in-one OK:', res.get('message', res)); print('Onboarding complete:', res.get('data', {}).get('onboarding_complete', False))"
