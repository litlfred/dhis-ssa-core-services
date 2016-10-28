var SystemInfo = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContext")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }
    this.nodeService = this.appContext.getBean("org.hisp.dhis.node.NodeService");
    this.systemService = this.appContext.getBean("org.hisp.dhis.system.SystemService");
}


SystemInfo.prototype.getData = function(format) {
    try {
	this.dhisScriptContext.logInfo("Getting sys info data in format " +  format);
	var node =  this.systemService.getSystemInfo();
	// var ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
	// var out = new ByteArrayOutputStream();
	switch(format) {
	case 'text/plain':
	case 'text':
	case 'string':
	    var ObjectMapper = Java.type("com.fasterxml.jackson.databind.ObjectMapper");
	    objectMapper = new ObjectMapper();
	    StringWriter = Java.type("java.io.StringWriter");
	    jsonString = new StringWriter();
	    objectMapper.writeValue(jsonString,node);
	    return jsonString.toString();
	case 'json':
	case 'application/json':
	    var ObjectMapper = Java.type("com.fasterxml.jackson.databind.ObjectMapper");
	    objectMapper = new ObjectMapper();
	    StringWriter = Java.type("java.io.StringWriter");
	    jsonString = new StringWriter();
	    objectMapper.writeValue(jsonString,node);
	    return  JSON.parse(jsonString.toString());
	default:
	     return node;
	}
    } catch (e) {
	throw new ErrorDHIS("Could not query for system info" +  "\n:" + e + "\n"
			    + "(" + e.lineNumber + "," + e.columnNumber + ") " + e.fileName
			    + "\n" +     e.stack );
    }
}
