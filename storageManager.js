const CONTENT_JUDGE_VERSION = "0.0.1";
const CONTENT_JUDGE_BUILD = "CJ-A0003";

var storageManager = {
    
    set: function (key, value) {
        
        localStorage.setItem(key, JSON.stringify(value));
        
    },
    get: function (key) {
        
        var storedValue = localStorage.getItem(key);
        
        if (storedValue === undefined || storedValue === "undefined") {
            return undefined;
        } else {
            return JSON.parse(localStorage.getItem(key));
        }
        
    },
    setDefault: function (key, value) {
        
        //This function will set a value only if that value hasn't been set before
        if (localStorage.getItem(key)) {
            
            return true;
            
        } else {
            
            storageManager.set(key, value);
            
        }
        
        
    }
    
}

//Set defaults for preferences
with (storageManager) {
    
    setDefault("highlightPrejump", true);
    setDefault("highlightRareWords", true);
    
}