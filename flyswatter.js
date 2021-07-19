var flyswatter = {
    
    sendBugReport: function (type) {
        
        var subject,
            body;
        
        switch (type) {
                
            case "unexpectedBehavior":
                subject = "Flyswatter: Bug Report";
                body = `Content Judge Version ${CONTENT_JUDGE_VERSION} Build ${CONTENT_JUDGE_BUILD}%0D%0APlease mention as much as possible about the bug you are experiencing below this line.`;
                break;
                
            case "contentError":
                subject = "Flyswatter: Bug Report";
                body = `Content Judge Version ${CONTENT_JUDGE_VERSION} Build ${CONTENT_JUDGE_BUILD}%0D%0APlease mention as much as possible about the content error you are experiencing below this line.`;
                break;
                
            case "featureSuggestion":
                subject = "Flyswatter: Bug Report";
                body = `Content Judge Version ${CONTENT_JUDGE_VERSION} Build ${CONTENT_JUDGE_BUILD}%0D%0APlease explain what feature you would like added below this line.`;
                break;
                
        }
        
        var mailtoURL = "mailto:quizwell@icloud.com?subject=" + subject + "&body=" + body;

        window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);
        
    }
    
};