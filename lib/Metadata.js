var Metadata = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContext")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }

    this.systemInfo = new SystemInfo(dhisScriptContext);
    this.metadataService = this.appContext.getBean("org.hisp.dhis.dxf2.metadata.MetadataExportService");
    this.nodeService = this.appContext.getBean("org.hisp.dhis.node.NodeService");
}


Metadata.prototype.retrieveBySchema = function (schema,id,format) {
    var ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
    var HashMap = Java.type("java.util.HashMap");
    var ArrayList = Java.type("java.util.ArrayList");
    var alist = new ArrayList();
    var mapParams =  new HashMap();
    var out = new ByteArrayOutputStream();
    alist.add("true");
    mapParams.put(schema,alist);

    if (id) {
	throw new Error("BOK id");
	mapParams.put("id",id);  //not sure if this works or not
    }
    try {
	var params = this.metadataService.getParamsFromMap(mapParams);
	var node = this.metadataService.getMetadataAsNode(params);
	switch(format) {
	case 'text/plain':
	case 'text':
	case 'string':
	    return  node.toString();
	case 'text/xml':
	case 'application/xml':
	case 'xml':
	    this.nodeService.serialize(node,'application/xml',out);
	    return  out.toString();
	case 'application/json':
	case 'json':
	    this.nodeService.serialize(node,'application/json',out);
	    return  JSON.parse(out.toString());
	default:
	    return node;
	}
    } catch (e) {
	throw new ErrorDHIS("Could not query for data elements:\n" + mapParams + "\n:" + e + "\n"
			    + "(" + e.lineNumber + "," + e.columnNumber + ") " + e.fileName
			    + "\n" +     e.stack );
    }
};

