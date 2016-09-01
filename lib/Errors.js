function ErrorResourceNotFound(message) {
    this.name = "ErrorResourceNotFound";
    this.message = (message || "");
}
ErrorResourceNotFound.prototype = Error.prototype;


function ErrorDHIS(message) {
    this.name = "ErrorDHIS";
    this.message = (message || "");
}
ErrorDHIS.prototype = Error.prototype;


function ErrorProcessing(message) {
    this.name = "ErrorProcessing";
    this.message = (message || "");
}
ErrorProcessing.prototype = Error.prototype;
