# Local Cart State Management

Cart state is managed entirely locally in the frontend using Zustand (and optionally localStorage) rather than persisting as draft transactions in the database. A database Transaction is only created upon successful payment. This guarantees instant UI response when scanning barcodes and prevents the database from filling up with abandoned drafts, aligning with our MVP focus on transaction speed, although it trades off the ability to seamlessly resume carts across different devices.
