# Event types

The types of events that are used to communicate between the different modules
of the application.

Examples:

- Rental posts a MOVIE_RENTED event.
- Pricing consumes it.
- Pricing calculates the price and posts a MOVIE_RENTAL_PRICED event.
- Accounting consumes the MOVIE_RENTAL_PRICED and creates an entry on the user's account.
