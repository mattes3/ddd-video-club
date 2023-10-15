curl -v -X POST -H "Content-Type: application/json" -d '{
  "customerId": "11111111-1111-1111-1111-111111111111",
  "movieId": "2596c2c6-58da-4066-befc-7c17b9a1cafe",
  "movieCategoryName": "Science Fiction",
  "movieTitle": "Matrix",
  "startOfRental": "'$(TZ=UTC date "+%Y-%m-%dT%H:%M:%SZ")'",
  "endOfRental": "'$(TZ=UTC date -v+3d "+%Y-%m-%dT%H:%M:%SZ")'"
}' https://localhost:5000/api/rentals
