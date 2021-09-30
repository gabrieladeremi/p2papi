# Peer to Peer payment api
This is a peer to peer payment api for transferring of money from one user to another making use of 
in-memory for storage.

# Requirements
The functionality that we want for this problem are: adding users to the app, 
users depositing money into the app, users sending money to other app users, 
users checking their balance in the app, and users transferring their money out of the app.

# Gettiing Started
After cloning the repository, `run yarn` to add all dependencies

# Registration
User will be registered after providing neccessary information (firstName, lastName, email, 
phone, address and password),validation of user input is done using JOI validator. 
Upon successfully registration, user data is returned excluding the hashed password.

# User Login
User will be logged in only when a validate email address and password that has been registered 
otherwise an error response message will be returned. JWT token is created for user  authentication and 
Authorisation. Add the `token` as Beearer Token for Authorization as parameter in the header of the request.

Note: Only authenticated user is allowed to make transfer and deposit.

# Deposit
Deposit can be made into a user's account by providing the email address and the amount to be deposited. 
A success message is returned if the deposit was successful else and error.

# Transfer
A user can make transfer to another registered user by the email of the receiver and amount to be sent.
The email is used to verified the receiver's account, a check is run on the sender's account to know if
the available balance is up to the required amount to be transfer. The transfer is then concluded by debitting 
the sender's account and crediting the receiver's account.

# Test
To run test on each controller, run `yarn test`.

