const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:joejackson@numiko.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { subscription, delay = 10 } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing push subscription' });
    }

    // Respond immediately so the client knows it's scheduled
    res.status(200).json({ message: 'Push scheduled' });

    // Wait the requested delay, then send
    await new Promise(resolve => setTimeout(resolve, delay * 1000));

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Push Demo',
        body: 'hello'
      })
    );

    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Push send error:', error.message);
    // If we already sent 200, we can't send an error response
    // Just log it
  }
};
