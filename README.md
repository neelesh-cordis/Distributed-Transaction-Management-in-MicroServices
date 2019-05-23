# Distributed-Transaction-Management-in-MicroServices

This is a micro-project for illustarting Handling of Distributed Transaction Management between multiple Microservices.
Here I have just takem example of 2 microservices participating in the Transaction

Prerequisites:
1> Nodejs 
2> MongoDB

Please follow below steps to Start the DEMO
1. Clone the repo
2. npm i
3. start the First Service by executing node serviceA.js in the terminal from root of the project
4. Similary start second service by node serviceB.js
5. Hit the URL http://localhost:3000/doit
6. This will create a User and dispatch an event to serviceB
7. On recieving Event, ServiceB will try to do its part. If In case error occurs, It will agin pass an event to ServiceA (Transaction Failed)
8. ServiceA will delete the resource created in Step 6
9. If the deletion will be succesfull , It will Log "Rollback Accomplished" else "Rollback Failed"
10. (TO DO) if Deletion fails , A message can be pushed to some sort of Queue where the consumer of this queue will retry Rollback again,  agreed no of times
