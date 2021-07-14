var flyswatter = {
    
    sendBugReport: function () {
        
        var mailtoURL = "mailto:quizwell@icloud.com?subject=Content%20Judge%3A%20Bug%20Report&body=Please%20mention%20as%20much%20as%20possible%20about%20the%20bug%20or%20content%20error%20you%20are%20experiencing%2E";

        window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);
        
    }
    
};