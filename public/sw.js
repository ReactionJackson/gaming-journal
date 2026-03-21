self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Gaming Journal';
  const options = {
    body: data.body || 'hello',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'gaming-journal-push',
    renotify: true,
    data: { message: data.body || 'hello' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const message = event.notification.data?.message || '';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // If the app is already open, focus it and post the message
      for (var client of windowClients) {
        if (client.visibilityState === 'visible' || client.url.includes('/')) {
          client.postMessage({ type: 'notification-click', message: message });
          return client.focus();
        }
      }
      // Otherwise open a new window — the hook will pick up the message once it mounts
      return clients.openWindow('/friends').then(function(newClient) {
        // Small delay to let the page load before posting
        if (newClient) {
          setTimeout(function() {
            newClient.postMessage({ type: 'notification-click', message: message });
          }, 1000);
        }
      });
    })
  );
});
