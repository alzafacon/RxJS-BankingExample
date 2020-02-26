const { BehaviorSubject, Observable, merge, partition, zip } = require('rxjs');
const { publish, filter, share, map } = require('rxjs/operators');

const N_CUSTOMERS = 5;

var bank = Array.from({length: N_CUSTOMERS}, _ => ({balance: 1000, loan: 0}));

const ACTIONS = [DEPOSIT, WITHDRAWAL, LOAN] = ['deposit', 'withdrawal', 'loan'];

function createCustomer(id) {
    return new Observable(subscriber => {
        console.log('Customer '+id+ ' created');
        // visit the bank 3 times
        for (let i = 0; i < 3; i++) {     
            var action = ACTIONS[getRndInteger(0, 2)];
            var amount = getRndInteger(1, 5) * 100;
            console.log('Customer '+id+' requesting '+action+' of '+amount);
            subscriber.next({id, action, amount});
        }
       
        setTimeout(() => {
            console.log('Customer '+id+' leaving bank. timeout');
            subscriber.complete();
        }, 1 * 1000);
    });
}

var customers = Array.from({length: N_CUSTOMERS}, (_, i) => createCustomer(i));

var customer_queue = merge(...customers).pipe(publish());
var [loan_queue, teller_queue] = partition(customer_queue, v => v.action == LOAN);

console.log('Loan Officer created');
loan_queue.subscribe(next => {
    console.log('Loan Officer serving Customer '+next.id)
    console.log('Loan Officer approves loan for Customer '+next.id);
    bank[next.id].loan += next.amount;
});

var [TELLER0, TELLER1] = ['Teller 0', 'Teller 1'];
var teller0 = new BehaviorSubject(TELLER0);
var teller1 = new BehaviorSubject(TELLER1);

var availableTeller = merge(teller0, teller1);

var assignedReq = zip(availableTeller, teller_queue).pipe(
    map(([tellerId, req]) => ({tellerId, req})),
    share() // no need to call connect
);

function createTeller(tellerName, tellerInst) {
    assignedReq.pipe(
        filter(_ => _.tellerId == tellerName),
        map(_ => _.req)
    ).subscribe(next => {
        console.log(tellerName+' serving Customer '+next.id);
        console.log(tellerName+' processes '+next.action+' of '+next.amount+' for customer '+next.id);
        if (next.action == DEPOSIT) {
            bank[next.id].balance += next.amount;
        } else {
            bank[next.id].balance -= next.amount;
        }
        tellerInst.next(tellerName); // signal teller is available
    })
}

console.log(TELLER0+' created')
createTeller(TELLER0, teller0)

console.log(TELLER1+' created');
createTeller(TELLER1, teller1);

customer_queue.connect(); // bank opens for business

customer_queue.subscribe(next => {}, error => {}, complete => console.log(bank))

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
