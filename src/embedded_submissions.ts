import faker from 'faker';
import { v4 } from 'uuid';
import * as cb from './couchbase';

const formKey = v4();
let submissions = 30_000;

(async () => {
  await cb.connect();

  await cb.insertForm(formKey, {
    name: faker.random.word(),
    questions: [],
    submissions: [],
  });

  let newSubmissions = [];
  while (submissions) {
    newSubmissions.push({
      id: v4(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: faker.address.streetAddress(),
      rating: faker.random.number(5),
      review: faker.random.words(20),
    });

    //batch into groups of 1000
    if (!(newSubmissions.length % 1000)) {
      console.log('Inserting');
      await cb.updateSubArray(formKey, 'submissions', newSubmissions);
      newSubmissions = [];
    }
    submissions--;
  }

  cb.close();
})();
