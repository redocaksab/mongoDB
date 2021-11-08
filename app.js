'use strict'

const { mapUser, getRandomFirstName, mapArticle } = require('./util')

// db connection and settings
const connection = require('./config/connection')
let articleCollection;
run()

async function run() {
  await connection.connect();
  await connection.get().dropCollection('articles');
  await connection.get().createCollection('articles');
  articleCollection = connection.get().collection('articles');


  await createArticles();
  await updateTagList();
  await addTags();
  await findArticles();
  await pullTags();

  //await example1()
  //await example2();
  //await example3();
  //await example4();
  await connection.close();
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1() {
  try {
    const deps = ['a', 'a', 'b', 'b', 'c', 'c'];
    const users = deps.map(department => mapUser({ department }));
    await userCollection.insertMany(users);
  } catch (err) {
    console.error(err)
  }
}
// - Delete 1 user from department (a)
async function example2() {
  try {
    await userCollection.deleteOne({ department: 'a' });
  } catch (err) {
    console.error(err)
  }
}
// - Update firstName for users from department (b)
async function example3() {
  try {
    const usersB = await userCollection.find({ department: 'b' }).toArray();
    const bulkWrite = usersB.map(user => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { firstName: getRandomFirstName() } }
      }
    }))
    await userCollection.bulkWrite(bulkWrite);
  } catch (err) {
    console.error(err)
  }
}
// - Find all users from department (c)
async function example4() {
  try {
    const usersC = await userCollection.find({ department: 'c' }).toArray();
    console.log("UsersC: ", usersC);
  } catch (err) {
    console.error(err)
  }
}

// #### Articles

// - Create 5 articles per each type (a, b, c)
async function createArticles() {
  try {
    const types = ['a', 'b', 'c'];
    let articles = [];
    for (let type of types) {
      for (let i = 0; i < 5; i++) {
        articles.push(mapArticle({ type }));
      }
    }
    await articleCollection.insertMany(articles);
  } catch (err) {
    console.error(err)
  }
}

// - Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]

async function updateTagList() {
  try {
    await articleCollection.updateMany({ type: 'a' }, {
      $set:
      {
        tags: ['tag1-a', 'tag2-a', 'tag3']
      }
    });
  } catch (err) {
    console.error(err)
  }
}

// - Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a

async function addTags() {
  try {
    await articleCollection.updateMany({ type: { $ne: 'a' } }, {
      $set:
      {
        tags: ['tag2', 'tag3', 'super']
      }
    })
  } catch (err) {
    console.error(err)
  }
}

// - Find all articles that contains tags [tag2, tag1-a]

async function findArticles() {
  try {
    await articleCollection.find({tags:{ $in: ['tag2', "tag1-a" ] }}).toArray();
  } catch (err) {
    console.error(err)
  }
}

// - Pull [tag2, tag1-a] from all articles

async function pullTags() {
  try {
    await articleCollection.updateMany( { },
      { $pull: { tags: { $in: [ 'tag2', "tag1-a" ] }}});
  } catch (err) {
    console.error(err)
  }
}

