import uuid from 'uuid';

import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function create(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      id: uuid.v1(),
      name: data.name,
      age: data.age,
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}

export async function list(event, context) {
  const params = {
    TableName: process.env.tableName,
  };

  try {
    const result = await dynamoDbLib.call('scan', params);
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}

export async function get(event, context) {
  const params = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id,
    },
  };
  console.log(params);
  try {
    const result = await dynamoDbLib.call('get', params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: 'Item not found.' });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
