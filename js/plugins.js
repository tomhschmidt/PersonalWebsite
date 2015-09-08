// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
(function($){   

    //Main method
    $.fn.json2html = function(json, transform, _options){   
        
        //Make sure we have the json2html base loaded
        if(typeof json2html === 'undefined') return(undefined);

        //Default Options
        var options = {
            'append':true,
            'replace':false,
            'prepend':false,
            'eventData':{}
        };

        //Extend the options (with defaults)
        if( _options !== undefined ) $.extend(options, _options);

        //Insure that we have the events turned (Required)
        options.events = true;
        
        //Make sure to take care of any chaining
        return this.each(function(){ 
            
            //let json2html core do it's magic
            var result = json2html.transform(json, transform, options);
            
            //Attach the html(string) result to the DOM
            var dom = $(document.createElement('i')).html(result.html);

            //Determine if we have events
            for(var i = 0; i < result.events.length; i++) {
                
                var event = result.events[i];

                //find the associated DOM object with this event
                var obj = $(dom).find("[json2html-event-id-"+event.type+"='" + event.id + "']");

                //Check to see if we found this element or not
                if(obj.length === 0) throw 'jquery.json2html was unable to attach event ' + event.id + ' to DOM';
                
                //remove the attribute
                $(obj).removeAttr('json2html-event-id-'+event.type);

                //attach the event
                $(obj).on(event.type,event.data,function(e){
                    //attach the jquery event
                    e.data.event = e;

                    //call the appropriate method
                    e.data.action.call($(this),e.data);
                });
            }

            //Append it to the appropriate element
            if (options.replace) $.fn.replaceWith.apply($(this),$(dom).children());
            else if (options.prepend) $.fn.prepend.apply($(this),$(dom).children());
            else $.fn.append.apply($(this),$(dom).children());
        });
    };
})(this.jQuery);