// Define relevant info
var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNDNlYmY2NC0yNTg1LTRiMmQtYjAxNi1iNGRlZTk4NjgyN2IifQ.Le4epmZvwCDbJlSniw9QRlHuTkSMnZYhTTYgPVFqNpA';
// Auth token for Bonsai Api
var authToken = "Basic " + btoa('gmfi1py62w' + ":" + '4g9jgk6eea');
var tokens = [];
var profile = "hfapp";
var appId = '756d4b92';
var options = {
    'remember': true
};
var details = {
    'email': 'example@example.com',
    'password': 'secretpassword'
};

// optionally passed custom data
details.custom = {
    'avatar': 'http://ionicframework.com/img/docs/mcfly.jpg'
};

// Build the request object
var req = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
    },
    notification: {
        "tokens": tokens,
        "profile": "hfapp",
        "notification": {
            "alert": "{#type#:#cms#,#tagupdated#:#1#}"
        }
    }
};

function updateIonicUser($rootScope) {
    var user = Ionic.User.current();
    user.set('avatar', $rootScope.profile.avatar);
    user.set('name', $rootScope.profile.name);
    user.set('email', $rootScope.profile.email);
    user.save();
}

function kickOffpush($rootScope, $ionicPopup, $ionicPlatform, $ionicPush) {
    // kick off the platform web client
    $ionicPush.init({
        "debug": true,
        "onNotification": function(notification) {
            // var text = notification._raw.text; -- for dummy push
            var text = notification.text; // for real push
            text = text.replace(/#/g, '"');
            var pushNote = $rootScope.$eval(text);
            $rootScope.pushNotes.push(pushNote);
            $rootScope.notificationCount = $rootScope.pushNotes.length;
            if (!$rootScope.silenceNotification) {
                var popup = $ionicPopup.alert({
                    title: "<i class='icon ion-lightbulb'></i>  Fund Notification",
                    template: pushNote.title
                });
            }
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            console.log("added ", pushNote);
        },
        "onRegister": function(data) {
            $rootScope.deviceToken = data.token;
            user.addPushToken(data.token);
            user.save();
        },
        "pluginConfig": {
            "ios": {
                "badge": true,
                "sound": true
            },
            "android": {
                "iconColor": "#343434"
            }
        }
    });
    $ionicPush.register();

}
