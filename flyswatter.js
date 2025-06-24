var flyswatter = {
    
    sendBugReport: function (optionID) {
        
        var subject = "Flyswatter: Bug Report";
        var body = `Content Judge Version ${CONTENT_JUDGE_VERSION} Build ${CONTENT_JUDGE_BUILD}%0D%0A${optionID}%0D%0APlease mention as much as possible about the problem you are experiencing below this line.`;
        
        var mailtoURL = "mailto:quizwell@icloud.com?subject=" + subject + "&body=" + body;

        window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);
        
    }
    
};