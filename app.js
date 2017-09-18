var builder = require('botbuilder');
var restify = require('restify');



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });

 // Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: 'cc202a1b-4082-4095-bd70-fd1fa4eb41b3',
    appPassword: 'JdMx2BERqA9CR3sm1YqxqoL'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



//Bot Launch Dialog
var bot = new builder.UniversalBot(connector, [
    function(session){
      session.send('Welcome To Devslopes! Please click on your selection from our menu.');
      session.beginDialog('mainMenu');
    },  
]);

//===============================================================
//   --------------   Help Dialog --------------         
//===============================================================

//Help Dialog
bot.dialog('help', [
    function (session) {
        session.endDialog(session, "Main Menu", mainMenu,{ listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.beginDialog(mainMenu[results.response.entity].item);
        }
    }
])


//===============================================================
//   --------------   Main Menu Dialog --------------         
//===============================================================

//Main Menu Bot Dialog
bot.dialog('mainMenu', [
    function (session) {
        builder.Prompts.choice(session, "Main Menu", mainMenu,{ listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.beginDialog(mainMenu[results.response.entity].item);
        }
    }
]);

// Main Menu To Be Displayed at Bot Launch
var mainMenu = {
    "Billing Question": {
        item: "billingQuestion"
    },
    "Get Help With Your Code": {
        item: "courseHelp"
    },
    "Check Out New Courses": {
        item: "newCourses"
    },
}

//===============================================================
//   --------------   Billing Question Dialog --------------      Level 1    
//===============================================================

//Billing Question Bot Dialog
bot.dialog('billingQuestion', [
    function (session) {
        session.send("What type of billing question do yo have?");
        builder.Prompts.choice(session, "Billing Menu:", billingMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(billingMenu[results.response.entity].item);
        }
    }
])

//Billing Menu for Bot Dialog
var billingMenu = {
   "Payment Problems": {
        item: "payment"
    },
    "Subscriptions": {
        item: "subscriptions"
    }, 
}

//===============================================================
//   --------------   Payment Help Dialog --------------           Billing Level 2 (Payment)
//===============================================================



//Payment Question Bot Dialog
bot.dialog('payment', [
    function (session) {
        session.send("");
        builder.Prompts.choice(session, "Payment:", paymentMenu, { listStyle: builder.ListStyle.button});
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(paymentMenu[results.response.entity].item);
        }
    }
])

//Payment for Bot Dialog
var paymentMenu = {
   "Change Credit Card on File": {
        item: "changeCreditCard"
    },
   "Cancel Membership": {
       item: "cancelMembership"
   }
}


//===============================================================
//   --------------   Change Credit Card Bot Dialog --------------           Billing Level 3 (Change Credit Card)
//===============================================================



//Payment Question Bot Dialog
bot.dialog('changeCreditCard', [
    function (session) {
        session.send("No Problem, We can certainly take care of that for you. We just need to gather a few details.");
        builder.Prompts.text(session, "Please enter your first and last name?");
    },
    function(session, results) {
        session.send("Thank you %s", results.response);
        builder.Prompts.text(session, "What is your email?")
    },
    function(session) {
        session.send("Thank you for providing your email!");
        builder.Prompts.text(session, "Please enter your new credit card number?")
    },
    function(session,results) {
        session.send("Thank you! We will update your credit card information withing 24-48 hours.");
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }

])

//Yes No Menu for Bot Dialog
var yesNoMenu = {
   "Yes": {
        item: "yes"
    },
    "No": {
        item: "no"
    }, 
}


//===============================================================
//   --------------   Cancel Membership Bot Dialog --------------           Billing Level 3 (Cancel Membership)
//===============================================================



//Cancel Membership Question Bot Dialog
bot.dialog('cancelMembership', [
    function (session) {
        session.send("We are sorry to see you go? In order to cancel your membership We need a few things.");
        builder.Prompts.text(session, "Please enter your first and last name?");
    },
    function(session, results) {
        session.send("Thank you %s", results.response);
        builder.Prompts.text(session, "What is your email?")
    },
    function(session) {
        session.send("Thank you for providing your email!");
        builder.Prompts.text(session, "Please provide the last 4 digits of the matching credit card on file.")
    },
    function(session,results) {
        session.send("Thank you!");
        builder.Prompts.choice(session, "Are you sure you want to leave the best learning platform in the world? We would really really miss you?", cancelYesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(cancelYesNoMenu[results.response.entity].item);
        }
    }

])

//Yes No Menu for Bot Dialog
var cancelYesNoMenu = {
   "Yes": {
        item: "cancelyes"
    },
    "No": {
        item: "cancelno"
    }, 
}

//===============================================================
//   --------------  Cancel Yes Bot Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('cancelyes', [
    function (session) {
        session.send("Ok, It was worth a shot. We hope you come back soon!");
        builder.Prompts.text(session, "Please Type the world 'Cancel' to confirm!");
    },
    function(session) {
        session.endDialog("Thank you! Your Membership has been canceled! Please close your chat window and have a great day!");
    },
])

//===============================================================
//   --------------  Cancel No Bot Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('cancelno', [
    function (session) {
        session.send("That is great! You are making a great decision.");
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
    
])







//===============================================================
//   --------------   Course Help Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('courseHelp', [
    function (session) {
        session.send("What course do you need help with?");
        builder.Prompts.choice(session, "Course Menu:", courseHelpMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(courseHelpMenu[results.response.entity].item);
        }
    }
])

//Course Help Menu for Bot Dialog
var courseHelpMenu = {
   "Apple Slope": {
        item: "apple"
    },
    "Android Slope": {
        item: "android"
    }, 
    "Web Development Slope": {
        item: "webSlope"
    },
}


//===============================================================
//   --------------   New Courses Dialog --------------           Level 1
//===============================================================

//Course Help Bot Dialog
bot.dialog('newCourses', [
    function (session) {
        builder.Prompts.choice(session, "Course Menu: What are you interested in learning?", CardNames, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {

        // create the card based on selection
        var selectedCardName = results.response.entity;
        var card = createCard(selectedCardName, session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
])

var kotlinCard = 'Kotlin for Android';
var masterDesignCard = 'Mastering App Design Card';
var productDesignCard = 'Mobile Product Design Card'

var CardNames = [kotlinCard, masterDesignCard, productDesignCard];

function createCard(selectedCardName, session) {
    switch (selectedCardName) {
        case kotlinCard:
            return kotlinVideo(session);
        case masterDesignCard:
            return masterDesign(session);
        case productDesignCard:
            return productDesign(session);
        default:
            return session.send("Thanks");
    }
}

//===============================================================
//   --------------   New Course Dialogs --------------           Level 2
//===============================================================

function kotlinVideo(session) {
    return new builder.VideoCard(session)
        .title('Kotlin For Android')
        .subtitle('Beginner')
        .text('Kotlin is an expressive, concise & powerful development language on Android. Learn everything you need to know to start developing apps with Kotlin')
        .image(builder.CardImage.create(session, 'https://s3.amazonaws.com/devslopes-course-assets/AppImages/courseImages/Android/Kotlin.png'))
        .media([
            { url: 'https://vimeo.com/232190093' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://devslopes.com/course/598d1a85277ee903051ab0ee', 'Learn More')
        ]);
}

function masterDesign(session) {
    return new builder.VideoCard(session)
        .title('Mastering Mobile App Design with Sketch 3')
        .subtitle('Beginner')
        .text('Learn the basics of Sketch. With these skills you will master UX & UI design for Mobile Apps & Websites.')
        .image(builder.CardImage.create(session, 'https://devslopes-course-assets.s3.amazonaws.com/AppImages/MacCourseImages/Design/MasteringMobileDesign.png'))
        .media([
            { url: 'https://vimeo.com/179100253' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://devslopes.com/course/589b9d53d211ad4ffa5cafcc', 'Learn More')
        ]);
}

function productDesign(session) {
    return new builder.VideoCard(session)
        .title('Mobile Product Design: From Napkin to Launch')
        .subtitle('Beginner')
        .text('Design mobile apps in Sketch 3 & learn the business principles behind product design like user engagement & app virality')
        .image(builder.CardImage.create(session, 'https://devslopes-course-assets.s3.amazonaws.com/AppImages/MacCourseImages/Design/MobileProductDesign.png'))
        .media([
            { url: 'https://vimeo.com/197316256' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://devslopes.com/course/589b9d53d211ad4ffa5cafcd', 'Learn More')
        ]);
}




//===============================================================
//   --------------   Yes Bot Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('yes', [
    function (session) {
        builder.Prompts.choice(session, "Main Menu: What can we help you with?", mainMenu,{ listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.beginDialog(mainMenu[results.response.entity].item);
        }
    }
])

//===============================================================
//   --------------   No Bot Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('no', [
    function (session) {
        session.endDialog("Thank You For Visiting Devslopes, Please Come Back and Visit again Soon.");
    },
])























