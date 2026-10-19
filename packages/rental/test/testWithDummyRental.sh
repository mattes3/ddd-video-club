# GNU date (Linux) understands -d, BSD date (macOS) understands -v
END_OF_RENTAL=$(date -u -d '+3 days' "+%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+3d "+%Y-%m-%dT%H:%M:%SZ")

curl -v -X POST -H "Content-Type: application/json" -d '{
  "customerId": "11111111-1111-1111-1111-111111111111",
  "movieId": "2596c2c6-58da-4066-befc-7c17b9a1cafe",
  "movieCategoryName": "Science Fiction",
  "movieTitle": "Matrix",
  "startOfRental": "'$(date -u "+%Y-%m-%dT%H:%M:%SZ")'",
  "endOfRental": "'$END_OF_RENTAL'"
}' http://localhost:5001/api/rentals
