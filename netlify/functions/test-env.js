export async function handler(event, context) {
  // Environment Variable aus Netlify
  const secretValue = process.env.MY_SECRET;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Environment Variable erfolgreich gelesen!",
      value: secretValue ? secretValue : "Nicht gesetzt"
    }),
  };
}