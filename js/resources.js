/* Resources.js
Simple image loading utility
Eases the process of loading image files for use in game
Caches image for performance reasons
 */
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* 
    Publicly accessible image loading function
    Accepts an array of strings pointing to image files or a string for a single image 
    Calls private image loading function accordingly
    */
    function load(urlOrArr) {

        if(urlOrArr instanceof Array) { // loop through input array and call _load on each
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } 

        else { // input not an array - call _load directly
            _load(urlOrArr);
        }
    }

    /* 
    Private image loader function
    Called by the public image loader load()
    */
    function _load(url) {

        if(resourceCache[url]) {
            /* 
            URL has been previously loaded and so exists within resourceCache array
            Return that image rather re-loading the image.
            */
            return resourceCache[url];
        } 

        else {
            /* 
            URL has not been previously loaded and is not present within cache
            Need to re-load image
            */
            var img = new Image();
            img.onload = function() {


                /*
                Once image has properly loaded, add to cache
                */
                resourceCache[url] = img;

                /* 
                Once image is loaded and cached call onReady() callbacks
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* 
            Set initial cache value to false
            Will change when image's onload event handler is called 
            Point images src attribute to the passed in URL
            */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* 
    Grabs references to images previously loaded
    If image is cached, same as load() for that URL
    */
    function get(url) {
        return resourceCache[url];
    }

    /* 
    Determines if all requested images have been loaded
    */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* 
    Adds function to callback stack, called when all requested images are  loaded
    */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* 
    Defines publicly accessible functions available
    */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();