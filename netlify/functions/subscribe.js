exports.handler = async function(event, context) {
  const data = JSON.parse(event.body);

  const email = data.email;
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
          method: 'POST',
          headers: {
              'Authorization': `apikey ${mailchimpApiKey}`,
              'Content-Type': 'application/json'
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
          body: JSON.stringify({ message: 'Subscription failed.', error: error.message })
      };
  }
};
