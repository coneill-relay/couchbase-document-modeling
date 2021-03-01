# Couchbase tests

## Getting started

```bash
docker-compose up -d
npm i

# to run
npm run start -- src/<file>
```

## indexes

## Results

At just 100k submissions of

```js
{
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: faker.address.streetAddress(),
    rating: faker.random.number(5),
    review: faker.random.words(20),
}
```

Storing all the submission data in one doc starts to break down. Couchbase does do compression to save disk space but the size calculated is on the uncompressed size.

Storing a subdocument of submission ids

```js
{
    form: "id",
    submissions: [...uuids]
}
```

Seems to break down around 300k to 400k items. Couchbase does not like unbounded arrays.

Storing the submission data as a seperate document and keeping a reference to the original form seems to be the best way to handle it.
