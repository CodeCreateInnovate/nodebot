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
    appPassword: 'dej50tpbwfMRKpYiisfgkDY'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

server.get('/', restify.plugins.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));


//Bot Launch Dialog
var bot = new builder.UniversalBot(connector, [
    function(session){
      session.send('Welcome To Devslopes! What can we help with today?');
      session.beginDialog('mainMenu');

    },
            
]);



// //Send Proactive Message to Start Conversation on connect.
// bot.on('conversationUpdate', function (message) {
//     if (message.membersAdded) {
//         message.membersAdded.forEach(function (identity) {
//             if (identity.id === message.address.bot.id) {
//                 bot.beginDialog(message.address, '/');
//             }
//         });
//     }
// });

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
    "Free Coding Lessons": {
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
   "Payment": {
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
//   --------------   Subscriptions Help Dialog --------------           Billing Level 2 (Subscriptions)
//===============================================================



//Payment Question Bot Dialog
bot.dialog('subscriptions', [
    function (session) {
        session.send("Sure, What can we help with?");
        builder.Prompts.choice(session, "Subscriptions:", subscriptionsMenu, { listStyle: builder.ListStyle.button});
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(subscriptionsMenu[results.response.entity].item);
        }
    }
])

//Payment for Bot Dialog
var subscriptionsMenu = {
   "Upgrade Membership Tier Plan": {
        item: "upgradeTier"
        //TODO -> Need to Create Bot Dialog
    },
   "Cancel Membership": {
       item: "cancelMembership"
   }
}

//===============================================================
//   --------------  Upgrade Tier Subscriptions Help Dialog --------------  Billing Level 3 (Upgrade Tier) -> Level 3
//===============================================================



//Payment Question Bot Dialog
bot.dialog('upgradeTier', [
    function (session) {
        session.send("Which Plan Would you like to upgrade to?");
        builder.Prompts.choice(session, "Upgrade Tier:", upgradeMenu, { listStyle: builder.ListStyle.button});
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(upgradeMenu[results.response.entity].item);
        }
    }
])

//Payment for Bot Dialog
var upgradeMenu = {
   "$10 Plan": {
        item: "10plan"
        //TODO -> Need to Create Bot Dialog
    },
    "$20 Plan": {
       item: "20plan"
       //TODO -> Need to Create Bot Dialog
   },
}

//===============================================================
//   --------------   $10 Upgrade Plan Bot Dialog --------------           Billing Level 4 ($10 Plan)
//===============================================================



//Payment Question Bot Dialog
bot.dialog('10plan', [
    function (session) {
        session.send("Execellent Decision! This plan includes access to over 200 hours of content including including pre-release access to main courses and offline downloads.");
        builder.Prompts.text(session, "To get started please enter your first and last name?");
    },
    function(session, results) {
        session.send("Thank you %s", results.response);
        builder.Prompts.text(session, "What is the email associated with your account?")
    },
    function(session) {
        session.send("Thank you for providing your email!");
        builder.Prompts.text(session, "For security, please verify the last four digits of the billing credit card on file.")
    },
    function(session,results) {
        session.send("Thank you! Your account should be updated in just a few short minutes. We will start charging the $10 upgrade on your next billing.");
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }

])

//===============================================================
//   --------------   $20 Upgrade Plan Bot Dialog --------------    Billing Level 4 ($20 Plan)
//===============================================================



//Payment Question Bot Dialog
bot.dialog('20plan', [
    function (session) {
        session.send("Execellent Decision! This plan includes access to over 350 hours of content including advanced topics.");
        builder.Prompts.text(session, "To get started please enter your first and last name?");
    },
    function(session, results) {
        session.send("Thank you %s", results.response);
        builder.Prompts.text(session, "What is the email associated with your account?")
    },
    function(session) {
        session.send("Thank you for providing your email!");
        builder.Prompts.text(session, "For security, please verify the last four digits of the billing credit card on file.")
    },
    function(session,results) {
        session.send("Thank you! Your account should be updated in just a few short minutes. We will start charging the $20 upgrade on your next billing.");
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }

])






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
        builder.Prompts.text(session, "Please enter your email address.")
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
        builder.Prompts.text(session, "Please enter your email address.")
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
//===============================================================
//   --------------   Course Help Dialog --------------           Level 1
//===============================================================


//Course Help Bot Dialog
bot.dialog('courseHelp', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let's find some for you!");
        builder.Prompts.choice(session, "What Learning track do you need help with?", courseHelpMenu, { listStyle: builder.ListStyle.button} );
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
//   --------------   Apple Slope Course Help Dialog --------------           Level 2
//===============================================================


//Course Help Bot Dialog
bot.dialog('apple', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let's find some for you!");
        builder.Prompts.choice(session, "What Learning track do you need help with?", appleHelpMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(appleHelpMenu[results.response.entity].item);
        }
    }
])

//Course Help Menu for Bot Dialog
var appleHelpMenu = {
   "UI Help": {
        item: "iosUi"
    },
    "Help With Data Storage": {
        item: "iosData"
    }, 
}


//===============================================================
//   --------------   IOS UI Slope Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('iosUi', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let's find some for you!");
        var iosUICards = getiosUICardsAttachments();

                    // create reply with Carousel AttachmentLayout
            var iosUIReply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(iosUICards);

            session.send(iosUIReply); 
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
            builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} ); 
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }

])

//===============================================================
//   --------------   Cards For IOS UI --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For IOS UI --------------           Level 4
//===============================================================

function getiosUICardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('Stack View Magic - Animating UIStackView in Swift 3')
            .subtitle('Beginner')
            .text('Learn a neat little hack to create a beautiful drop-down menu by animating a UIStackView the Devslopes way.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/ZRwZ3udgkFk' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/ZRwZ3udgkFk', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Designing a Profile Screen In Sketch for iOS and Android Tutorial')
            .subtitle('Beginner')
            .text('Learn how to design an elegant profile page for iOS and Android apps with Sketch 3')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/uQ0APeZZDnI' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/uQ0APeZZDnI', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title("3 Reasons Why It's Important to Design Your Apps First")
            .subtitle('Beginner')
            .text('Learn the benefits of designing your app before writing any code!')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/djdXkZ7xXr4' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/djdXkZ7xXr4', 'Learn More')
        ])
    ];
}



//===============================================================
//   --------------   IOS Data Storage Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('iosData', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        var iosDataCards = getiosDataCardsAttachments();

                    // create reply with Carousel AttachmentLayout
                    var iosDataReply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(iosDataCards);

            session.send(iosDataReply);
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
            builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    } 
])

//===============================================================
//   --------------   Cards For IOS Data --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For IOS Data --------------           Level 4
//===============================================================

function getiosDataCardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('Sorting Data in Firebase on iOS Tutorial')
            .subtitle('Beginner')
            .text('Learn how to sort data in the new Firebase. Firebase data is different than structured databases and sorting can be a challenge. Jess covers core principles in working with and sorting of data in Firebase.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/JH_0zZA0KQE' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/JH_0zZA0KQE', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('iOS Swift 3 Beginner Tutorial: Protocols & Delegates - Passing Data using the Delegate Method')
            .subtitle('Beginner')
            .text('Caleb shows how to create your own protocol in Swift 3 to pass data between ViewControllers.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/KhqXUi1SF4s' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/KhqXUi1SF4s', 'Learn More')
        ])
    ];
}




//===============================================================
//   --------------   Android Slope Course Help Dialog --------------           Level 2
//===============================================================


//Course Help Bot Dialog
bot.dialog('android', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        builder.Prompts.choice(session, "What Learning track do you need help with?", androidHelpMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(androidHelpMenu[results.response.entity].item);
        }
    }
])

//Course Help Menu for Bot Dialog
var androidHelpMenu = {
   "UI Help": {
        item: "androidUi"
    },
    "Help With Data Storage": {
        item: "androidData"
    }, 
}


//===============================================================
//   --------------   Android UI Slope Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('androidUi', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        var androidUICards = getAndroidUICardsAttachments();

                    // create reply with Carousel AttachmentLayout
                    var androidUIReply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(androidUICards);

            session.send(androidUIReply);
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
            builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
])

//===============================================================
//   --------------   Cards For Android UI --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For Android UI --------------           Level 4
//===============================================================

function getAndroidUICardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('How to Make Your Own iOS and Android App Icon Tutorial')
            .subtitle('Beginner')
            .text('In this beginner tutorial you will learn how to make app icons that can be used on iOS or Android using Sketch 3.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/xoMPTAA2-fE' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/xoMPTAA2-fE', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Designing a Profile Screen In Sketch for iOS and Android Tutorial')
            .subtitle('Beginner')
            .text('Learn how to design an elegant profile page for iOS and Android apps with Sketch 3.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/uQ0APeZZDnI' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/uQ0APeZZDnI', 'Learn More')
        ])
    ];
}




//===============================================================
//   --------------   Android Data Storage Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('androidData', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        var androidDataCards = getAndroidDataCardsAttachments();

                    // create reply with Carousel AttachmentLayout
                    var androidDataReply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(androidDataCards);

            session.send(androidDataReply);
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
            builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
])



//===============================================================
//   --------------   Cards For Android UI --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For Android UI --------------           Level 4
//===============================================================

function getAndroidDataCardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('Learn To Code With Android')
            .subtitle('Beginner')
            .text('Learn how to build your very own Android apps. This Android tutorial is for beginners. Learn to code today!')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/DsDfPCkS7f0' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/DsDfPCkS7f0', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Building The Devslopes Android App Part 1')
            .subtitle('Beginner')
            .text('Watch me build the official Devslopes Android app. In this video I show how to implement Firebase authentication for email and password.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/hxv8WzI1kGk' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/hxv8WzI1kGk', 'Learn More')
        ])
    ];
}



//===============================================================
//   --------------   Web Slope Course Help Dialog --------------           Level 2
//===============================================================


//Course Help Bot Dialog
bot.dialog('webSlope', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        builder.Prompts.choice(session, "What Learning track do you need help with?", webLanguageMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session, results) {
        if(results.response){
                    session.replaceDialog(webLanguageMenu[results.response.entity].item);
        }
    }
])

//Course Help Menu for Bot Dialog
var webLanguageMenu = {
   "React": {
        item: "react"
    },
    "Angular": {
        item: "angular"
    }, 
}

//===============================================================
//   --------------   React Slope Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('react', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        var reactCards = getReactCardsAttachments();

                    // create reply with Carousel AttachmentLayout
                    var reactReply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(reactCards);

            session.send(reactReply);
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
        builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
])

//===============================================================
//   --------------   Cards For React --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For React --------------           Level 4
//===============================================================

function getReactCardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('React Tutorial For Beginners')
            .subtitle('Beginner')
            .text('In this video you will learn how to setup your project for React development and you will build a simple React app with Node, Babelify, Watchify, Browserify, and React/ReactDOM npm packages')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/0ByoQm-vnYw' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/0ByoQm-vnYw', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Bootstrap Tutorial For Beginners')
            .subtitle('Beginner')
            .text('Get an in-depth look at how the Bootstrap grid system works so you can build responsive web apps with HTML, CSS, Javascript, Bootstrap, and React')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/ZFALVm8J-7M' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/ZFALVm8J-7M', 'Learn More')
        ])
    ];
}


//===============================================================
//   --------------   Angular Slope Course Help Dialog --------------           Level 3
//===============================================================


//Course Help Bot Dialog
bot.dialog('angular', [
    function (session) {
        session.send("We here at devslopes are here to help. We may have a few free slope sessions that meets your interests. Let find some for you!");
        var angularCards = getAngularCardsAttachments();

                    // create reply with Carousel AttachmentLayout
                    var angularReply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(angularCards);

            session.send(angularReply);
            session.send("We Hope This Helps! If you have addional questions please feel free to email our team! We look forward to hearing from you!")
            builder.Prompts.choice(session, "Is there anything else I can help you with?", yesNoMenu, { listStyle: builder.ListStyle.button} );
    },
    function (session,results) {
        if(results.response){
                    session.replaceDialog(yesNoMenu[results.response.entity].item);
        }
    }
    
])


//===============================================================
//   --------------   Cards For Angular --------------           Level 4
//===============================================================
//===============================================================
//   --------------   Cards For Angular --------------           Level 4
//===============================================================


function getAngularCardsAttachments(session) {
    return [
        new builder.VideoCard(session)
            .title('Angular 2 Beginner Tutorial - Setting up Angular 2 With Webpack')
            .subtitle('Beginner')
            .text('Intro to Angular 2 tutorial. How to set up Angular with the CLI & Webpack. Learn how to get Angular')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/ygxL30Jc2EQ?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/ygxL30Jc2EQ?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Angular Cli - How to Add Global Libraries')
            .subtitle('Beginner')
            .text('The Angular Cli can seem confusing when it comes to adding global libraries but in this tutorial I show you how to include them properly so that they will be included as part of your bundle.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/gtWPecKyEss?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/gtWPecKyEss?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK', 'Learn More')
        ]),
        new builder.VideoCard(session)
            .title('Angular 2: Adding a Markdown Parser "Marked"')
            .subtitle('Beginner')
            .text('In this tutorial I show you how to add a markdown parser "Using The Marked Library" to your Angular 2 application.')
            .image(builder.CardImage.create(session, ''))
            .media([
                { url: 'https://youtu.be/cS6RLbHrIQ4?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://youtu.be/cS6RLbHrIQ4?list=PLpZBns8dFbgzZdrGKrTTAi4NAfAbv5lMK', 'Learn More')
        ])
    ];
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
//   --------------   New Courses Video Cards For New Courses --------------  Level 2
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























