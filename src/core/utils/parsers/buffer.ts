/**
 * Converts `ArrayBuffer` to string (currently the default one)
 * @param buffer ArrayBuffer
 * @returns
 */
export function bufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}

/**
 * Converts `ArrayBuffer` to string (currently not used)
 * @param buffer ArrayBuffer
 * @returns
 */
 function arrayBufferToString(buffer: Buffer){

    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2,16)-1;

    for(var i = 0;i<length;i+=addition){

        if(i + addition > length){
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, Array.from(bufView.subarray(i,i+addition)));
    }

    return result;

}
