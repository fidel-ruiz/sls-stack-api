export function pong(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Serverless pong',
      input: event,
    }),
  };
}
