# Local PIN Authentication for Cashiers

We are using a device-level Supabase Auth session established by an Admin, and local PINs to switch the active Cashier profile in the frontend state, rather than creating individual Supabase Auth accounts for each cashier. This ensures shift changes are instant without requiring network roundtrips for login/logout, and simplifies user management, though it means security relies on the physical device being secured by the store.
