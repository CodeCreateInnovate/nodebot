var builder = require('botbuilder');


module.exports = [
    // Destination
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
];