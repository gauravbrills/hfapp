// Define relevant info
var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NmJlNDZkNy1mMzU4LTQ4NDEtYmM4ZC02NTQ3ODdiMDhlMmUifQ.tJU0hfLNwNu_fljgsYrNtELVLGHAosSP16prO2I2CKs';
  // Auth token for Bonsai Api
var authToken = "Basic " + btoa('gmfi1py62w' + ":" + '4g9jgk6eea');
var tokens = [];
var appId = 'c1f40904';
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

// Encode your key
//var auth = btoa(privateKey + ':');
// Build the request object
var req = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
    },
    data: {
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
            var text = notification.title; // for real push
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
