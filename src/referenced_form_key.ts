import faker from 'faker';
import { v4 } from 'uuid';
import * as cb from './couchbase';

const formKey = v4();
let submissions = 500_000;

(async () => {
  await cb.connect();

  await cb.insertForm(formKey, {
    name: faker.random.word(),
  });

  let newSubmissions = [];
  let inserts = [];
  while (submissions) {
    console.log(submissions);
    let sub = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: faker.address.streetAddress(),
      rating: faker.random.number(5),
      review: faker.random.words(20),
      submission_date: faker.date.past(2).getTime() / 1000,
    };
    newSubmissions.push(sub);
    inserts.push(cb.insertRecord(v4(), formKey, sub));

    //batch into groups of 1000
    if (!(newSubmissions.length % 1000)) {
      await Promise.all(inserts);
      newSubmissions = [];
      inserts = [];
    }
    submissions--;
  }

  cb.close();
})();

///CREATE INDEX form_idx on `form` (_form) where type = 'submission'
