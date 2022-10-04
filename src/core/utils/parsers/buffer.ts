/**
 * Converts `ArrayBuffer` to string (currently the default one)
 * @param buffer ArrayBuffer
 * @returns
 */
export function asString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}

/**
 * Consistent `Buffer`
 * @param input
 * @returns
 */
export function asBuffer(input: Buffer | Uint8Array | ArrayBuffer): Buffer {
    if (Buffer.isBuffer(input)) {
        return input;
    } else if (input instanceof ArrayBuffer) {
        return Buffer.from(input);
    } else {
        // Offset & length allow us to support all sorts of buffer views:
        return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    }
};

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
