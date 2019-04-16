// Initialise Pusher
const pusher = new Pusher('<YOUR_PUSHER_KEY_HERE>', {
    cluster: '<YOUR_PUSHER_CLUSTER_HERE>',
    encrypted: true
});

// Subscribe to movie_bot channel
const channel = pusher.subscribe('movie_bot');

// bind new_message event to movie_bot channel
channel.bind('new_message', function(data) {
    console.log(data)
    // Append human message
    $('.chat-container').append(`
        <div class="chat-message col-md-5 human-message">
            ${data.human_message}
        </div>
    `)
    
    // Append bot message
    $('.chat-container').append(`
        <div class="chat-message col-md-5 offset-md-7 bot-message">
        ${data.bot_message}
        </div>
    `)
});

$(function() {
    function submit_message(message) {
 
        $.post( "/send_message", {
            message: message, 
            socketId: pusher.connection.socket_id
        }, handle_response);
        
        function handle_response(data) {
            // append the bot repsonse to the div
            console.log(data.message)
            $('.chat-container').append(`
                <div class="chat-message col-md-5 offset-md-7 bot-message">
                    ${data.message}
                </div>
            `)
            // remove the loading indicator
            $( "#loading" ).remove();
        }
    }

    $('#target').on('submit', function(e){
        e.preventDefault();
        const input_message = $('#input_message').val()
        // return if the user does not enter any text
        if (!input_message) {
            return
        }
        
        $('.chat-container').append(`
            <div class="chat-message col-md-5 human-message">
                ${input_message}
            </div>
        `)
        
        // loading 
        $('.chat-container').append(`
            <div class="chat-message text-center col-md-2 offset-md-10 bot-message" id="loading">
                <b>...</b>
            </div>
        `)
        
        // clear the text input 
        $('#input_message').val('')
        
        // send the message
        submit_message(input_message)
    });
});