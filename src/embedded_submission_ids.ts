import faker from 'faker';
import { v4 } from 'uuid';
import * as cb from './couchbase';

const formKey = v4();
let submissions = 400_000;

(async () => {
  await cb.connect();

  await cb.insertForm(formKey, {
    name: faker.random.word(),
    questions: [],
    submissions: [],
  });

  let newSubmissions = [];
  while (submissions) {
    console.log(submissions);
    let sub = {
      id: v4(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: faker.address.streetAddress(),
      rating: faker.random.number(5),
      review: faker.random.words(20),
    };
    newSubmissions.push(sub);

    //batch into groups of 1000
    if (!(newSubmissions.length % 1000)) {
      await cb.updateSubArray(
        formKey,
        'data.submissions',
        newSubmissions.map((item) => item.id)
      );
      newSubmissions = [];
    }

    submissions--;
  }

  cb.close();
})();
