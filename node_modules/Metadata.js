var Metadata = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContextSE")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }

    this.systemInfo = new SystemInfo(dhisScriptContext);
}


Metadata.prototype.retrieveBySchema = function (schema,id,format) {
    var ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
    var HashMap = Java.type("java.util.HashMap");
    var ArrayList = Java.type("java.util.ArrayList");
    var DefaultNodeService = Java.type("org.hisp.dhis.node.NodeService");
    var DefaultMetadataService =  Java.type("org.hisp.dhis.dxf2.metadata.DefaultMetadataExportService");
    var alist = new ArrayList();
    var mapParams =  new HashMap();
    var metadataService = this.appContext.getBean(DefaultMetadataService);
    var nodeService = this.appContext.applicationContext.getBean(DefaultNodeService);
    var out = new ByteArrayOutputStream();
    alist.add("true");
    mapParams.put(schema,alist);
    if (id) {
	mapParams.put(id,id);  //not sure if this works or not
    }
    try {
	var params = metadataService.getParamsFromMap(mapParams);
	var node = metadataService.getMetadataAsNode(params);
	
	switch(format) {
	case 'text/plain':
	case 'text':
	    nodeService.serialize(node,'json',out);
	    return  out.toString();
	case 'text/xml':
	case 'application/xml':
	case 'xml':
	    nodeService.serialize(node,'xml',out);
	    return  out.toString();
	case 'application/json':
	case 'json':
	    nodeService.serialize(node,'json',out);
	    return  JSON.parse(out.toString());
	default:
	    return node;
	}
    } catch (e) {
	throw new ErrorDHIS("Could not query for data elements:\n" + mapParams + "\n");
    }
};

