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
  var message = event.notification.data?.message || '';

  // Store the click data in the Cache API so the app can read it
  event.waitUntil(
    caches.open('push-clicks').then(function(cache) {
      var response = new Response(JSON.stringify({
        message: message,
        timestamp: Date.now()
      }));
      return cache.put('/push-click-data', response);
    }).then(function() {
      return clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then(function(clientList) {
      // Try to focus an existing window
      for (var i = 0; i < clientList.length; i++) {
        if ('focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      // Otherwise open the app
      return clients.openWindow('/friends');
    })
  );
});
