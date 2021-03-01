import { Buffer } from 'buffer';
import faker from 'faker';
import { v4, parse } from 'uuid';
import * as cb from './couchbase';

const formKey = v4();
let submissions = 200_000;

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
      submission_date: faker.date.past(2).getTime(),
    };
    newSubmissions.push(sub);

    let base64url = Buffer.from(parse(formKey) as number[])
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .substr(0, 20);
    inserts.push(cb.insertRecord(v4(), base64url, sub));

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
