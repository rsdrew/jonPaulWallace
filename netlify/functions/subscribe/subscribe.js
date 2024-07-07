// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const email = JSON.parse(event.body).email;
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = process.env.MAILCHIMP_DC;

  console.log("TEST");

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/`;

  const subscriberData = {
    "email_address": email,
    "status": 'subscribed'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailchimpApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful!' })
    };

  } catch (error) {
    return { 
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString(),
        event: event,
        body: JSON.parse(event.body).email,
      })
    }
  }
}

module.exports = { handler }
