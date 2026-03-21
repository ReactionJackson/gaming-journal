self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  var title = data.title || 'Gaming Journal';
  var options = {
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
  var message = encodeURIComponent(event.notification.data?.message || '');
  event.waitUntil(clients.openWindow('/friends?from=push&message=' + message));
});
