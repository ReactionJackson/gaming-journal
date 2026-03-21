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
  var url = '/friends?from=push&message=' + message;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If the app is already open, navigate it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('navigate' in client) {
          return client.navigate(url).then(function(c) { return c.focus(); });
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});
