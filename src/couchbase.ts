import couchbase from 'couchbase';

let cluster: Cluster;
export const connect = async () => {
  cluster = await couchbase.connect('couchbase://localhost', {
    username: 'Administrator',
    password: 'password',
  });
};

export const insertForm = (key: string, item: Form) => {
  const bucket = cluster.bucket('form');
  const collection = bucket.defaultCollection();
  try {
    return collection.insert(`form::${key}`, { data: item, type: 'form' });
  } catch (e) {
    console.error(e);
  }
};

export const updateSubArray = (key: string, path: string, items: any[]) => {
  const bucket = cluster.bucket('form');
  const collection = bucket.defaultCollection();

  return collection.mutateIn(`form::${key}`, [
    couchbase.MutateInSpec.arrayAppend(path, items, { multi: true }),
  ]);
};

export const insertRecord = (id: string, formId: string, item: any) => {
  const bucket = cluster.bucket('form');
  const collection = bucket.defaultCollection();
  let sub = {
    _formbase64: formId,
    data: item,
    created_date: new Date(),
    type: 'submission',
  };

  return collection.insert(`sub::${id}`, sub);
};

export const close = () => {
  cluster.close();
};

///CREATE INDEX form_idx on `form` (_form) where type = 'submission'
