# An exercise to practice RxJS.
Adapted from a school project to learn inter-process communication via semaphores.
I learned that RxJS is not a good abstraction of threads/semaphores/concurrency/etc.

# Instructions
A bank is simulated by using threads and semaphores to model customer and employee behavior.
This project is similar to the “barbershop” example in the textbook. The following rules apply:

Customer:
1) 5 created initially, one thread each.
2) Each customer will make 3 visits to the bank.
3) Each customer starts with a balance of $1000.
4) On each visit a customer is randomly assigned one of the following tasks:
    1. make a deposit of a random amount from $100 to $500 in increments of $100
    2. make a withdrawal of a random amount from $100 to $500 in increments of $100
        - withdrawals may exceed the balance
    3. request a loan of a random amount from $100 to $500 in increments of $100
5) Steps for each task are defined in the task table.

Bank Teller:
1) Two created initially, one thread each.
2) Serves next customer in the teller line.
3) Processes customer request and updates customer balance.
Loan Officer:
1) One created initially as one thread.
2) Serves next customer in line for a loan.
3) Approves loan request and updates customer balance by adding the loan amount.  

Main
1) Creates and joins all customer threads.
2) When last customer has exited, prints the summary report and ends the simulation.

Other rules:
1) Each activity of each thread should be printed with identification (e.g., customer 1).
2) All mutual exclusion and coordination must be achieved with semaphores.
3) A thread may not use sleeping as a means of coordination.
4) Busy waiting (polling) is not allowed.
5) Mutual exclusion should be kept to a minimum to allow the most concurrency.
6) The semaphore value may not be obtained and used as a basis for program logic.
7) Each customer thread should print when it is created and when it is joined.
8) All activities of a thread should only be output by that thread.
9) Threads use sleep to simulate task time but scaled so that 1 minute only delays 1/10 second. 