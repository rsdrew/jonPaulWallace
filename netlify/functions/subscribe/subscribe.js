// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {

  debugger;

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    }
  }

  const email = JSON.parse(event.body).email;
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = process.env.MAILCHIMP_DC;

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/`;

  const subscriberData = {
    email_address: email,
    status: 'subscribed'
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${mailchimpApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriberData)
    });

    const responseData = await response.json();

    // Member already added
    if (response.status === 400 && responseData.title === "Member Exists") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "You're already signed up!" })
      }
    }

    if (!response.ok) {
      throw new Error(`Error: ${responseData}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Thanks for signing up! See you at the next show!" })
    };

  } catch (error) {
    return { 
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong. Please try again."
      })
    }
  }
}

module.exports = { handler }
